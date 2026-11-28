package reporting

import (
	"context"
	"database/sql"
	"errors"
)

var ErrNotFound = errors.New("not found")

type Totals struct {
	Revenue      int `json:"revenue"`
	Transactions int `json:"transactions"`
	TaxAmount    int `json:"tax_amount"`
}

type PaymentMethodTotal struct {
	PaymentMethod string `json:"payment_method"`
	Revenue       int    `json:"revenue"`
	Transactions  int    `json:"transactions"`
}

type BranchTotal struct {
	BranchID     string `json:"branch_id"`
	BranchName   string `json:"branch_name"`
	Revenue      int    `json:"revenue"`
	Transactions int    `json:"transactions"`
}

type SeriesPoint struct {
	Date         string `json:"date"`
	Revenue      int    `json:"revenue"`
	Transactions int    `json:"transactions"`
}

type Summary struct {
	From           string               `json:"from"`
	To             string               `json:"to"`
	Period         string               `json:"period"`
	Totals         Totals               `json:"totals"`
	PaymentMethods []PaymentMethodTotal `json:"payment_methods"`
	Branches       []BranchTotal        `json:"branches"`
	Series         []SeriesPoint        `json:"series"`
}

// SummaryFilter selects completed transactions by business_date; BranchID is optional.
type SummaryFilter struct {
	UMKMID   string
	BranchID string
	From     string // YYYY-MM-DD, inclusive
	To       string // YYYY-MM-DD, inclusive
	Period   string // daily | monthly
}

// Store defines persistence operations for the reporting module.
type Store interface {
	Summary(ctx context.Context, f SummaryFilter) (Summary, error)
}

type pgStore struct {
	db *sql.DB
}

func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

// Shared predicate for all summary queries: $1 umkm, $2 branch (” = all), $3 from, $4 to.
const txScope = `t.umkm_id = $1 AND ($2 = '' OR t.branch_id::text = $2)
	AND t.business_date BETWEEN $3::date AND $4::date
	AND t.status = 'completed' AND t.deleted_at IS NULL`

func (s *pgStore) Summary(ctx context.Context, f SummaryFilter) (Summary, error) {
	out := Summary{From: f.From, To: f.To, Period: f.Period, PaymentMethods: []PaymentMethodTotal{}, Branches: []BranchTotal{}, Series: []SeriesPoint{}}
	args := []any{f.UMKMID, f.BranchID, f.From, f.To}

	// Branch rows come first so a foreign or missing branch_id is a 404, and branches with no sales still show as zero.
	rows, err := s.db.QueryContext(ctx, `
		SELECT b.id, b.name, COALESCE(SUM(t.total), 0), COUNT(t.id)
		FROM branches b
		LEFT JOIN transactions t ON t.branch_id = b.id AND `+txScope+`
		WHERE b.umkm_id = $1 AND ($2 = '' OR b.id::text = $2) AND b.deleted_at IS NULL
		GROUP BY b.id, b.name, b.created_at
		ORDER BY b.created_at ASC`, args...)
	if err != nil {
		return Summary{}, err
	}
	for rows.Next() {
		var b BranchTotal
		if err := rows.Scan(&b.BranchID, &b.BranchName, &b.Revenue, &b.Transactions); err != nil {
			rows.Close()
			return Summary{}, err
		}
		out.Branches = append(out.Branches, b)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return Summary{}, err
	}
	if f.BranchID != "" && len(out.Branches) == 0 {
		return Summary{}, ErrNotFound
	}

	err = s.db.QueryRowContext(ctx, `
		SELECT COALESCE(SUM(t.total), 0), COUNT(*), COALESCE(SUM(t.tax_amount), 0)
		FROM transactions t WHERE `+txScope, args...,
	).Scan(&out.Totals.Revenue, &out.Totals.Transactions, &out.Totals.TaxAmount)
	if err != nil {
		return Summary{}, err
	}

	rows, err = s.db.QueryContext(ctx, `
		SELECT t.payment_method, SUM(t.total), COUNT(*)
		FROM transactions t WHERE `+txScope+`
		GROUP BY t.payment_method ORDER BY t.payment_method`, args...)
	if err != nil {
		return Summary{}, err
	}
	for rows.Next() {
		var p PaymentMethodTotal
		if err := rows.Scan(&p.PaymentMethod, &p.Revenue, &p.Transactions); err != nil {
			rows.Close()
			return Summary{}, err
		}
		out.PaymentMethods = append(out.PaymentMethods, p)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return Summary{}, err
	}

	unit := "day"
	if f.Period == "monthly" {
		unit = "month"
	}
	rows, err = s.db.QueryContext(ctx, `
		SELECT to_char(date_trunc($5, t.business_date), 'YYYY-MM-DD'), SUM(t.total), COUNT(*)
		FROM transactions t WHERE `+txScope+`
		GROUP BY 1 ORDER BY 1`, append(args, unit)...)
	if err != nil {
		return Summary{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var p SeriesPoint
		if err := rows.Scan(&p.Date, &p.Revenue, &p.Transactions); err != nil {
			return Summary{}, err
		}
		out.Series = append(out.Series, p)
	}
	return out, rows.Err()
}
