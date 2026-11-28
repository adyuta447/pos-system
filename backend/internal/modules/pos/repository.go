package pos

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

var ErrNotFound = errors.New("not found")

type Transaction struct {
	ID            string     `json:"id"`
	BranchID      string     `json:"branch_id"`
	BranchName    string     `json:"branch_name"`
	CashierID     string     `json:"cashier_id"`
	CashierName   string     `json:"cashier_name"`
	ReceiptNo     string     `json:"receipt_no"`
	BusinessDate  string     `json:"business_date"`
	OrderType     string     `json:"order_type"`
	PaymentMethod string     `json:"payment_method"`
	Subtotal      int        `json:"subtotal"`
	TaxName       string     `json:"tax_name"`
	TaxRateBP     int        `json:"tax_rate_bp"`
	TaxInclusive  bool       `json:"tax_inclusive"`
	TaxAmount     int        `json:"tax_amount"`
	Total         int        `json:"total"`
	Received      int        `json:"received"`
	ChangeAmount  int        `json:"change_amount"`
	Status        string     `json:"status"`
	VoidReason    string     `json:"void_reason,omitempty"`
	VoidedAt      *time.Time `json:"voided_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	Items         []Item     `json:"items,omitempty"`
}

type Item struct {
	ID          string `json:"id"`
	ProductID   string `json:"product_id"`
	ProductName string `json:"product_name"`
	Price       int    `json:"price"`
	Qty         int    `json:"qty"`
	LineTotal   int    `json:"line_total"`
}

// ListFilter narrows the owner's transaction history; empty fields are ignored.
type ListFilter struct {
	UMKMID        string
	BranchID      string
	CashierID     string
	PaymentMethod string
	Status        string
	From          string // YYYY-MM-DD, inclusive
	To            string // YYYY-MM-DD, inclusive
	Limit         int
	Offset        int
}

// Store defines persistence operations for the pos module.
type Store interface {
	ListTransactions(ctx context.Context, f ListFilter) ([]Transaction, int, error)
	GetTransaction(ctx context.Context, umkmID, id string) (Transaction, error)
}

type pgStore struct {
	db *sql.DB
}

func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

const txSelect = `
	SELECT t.id, t.branch_id, b.name, COALESCE(t.cashier_id::text, ''), COALESCE(s.name, ''), t.receipt_no,
	       to_char(t.business_date, 'YYYY-MM-DD'), t.order_type, t.payment_method, t.subtotal, t.tax_name,
	       t.tax_rate_bp, t.tax_inclusive, t.tax_amount, t.total, t.received, t.change_amount, t.status,
	       COALESCE(t.void_reason, ''), t.voided_at, t.created_at
	FROM transactions t
	JOIN branches b ON b.id = t.branch_id
	LEFT JOIN branch_staff s ON s.id = t.cashier_id`

func scanTransaction(row interface{ Scan(...any) error }) (Transaction, error) {
	var t Transaction
	err := row.Scan(&t.ID, &t.BranchID, &t.BranchName, &t.CashierID, &t.CashierName, &t.ReceiptNo,
		&t.BusinessDate, &t.OrderType, &t.PaymentMethod, &t.Subtotal, &t.TaxName,
		&t.TaxRateBP, &t.TaxInclusive, &t.TaxAmount, &t.Total, &t.Received, &t.ChangeAmount, &t.Status,
		&t.VoidReason, &t.VoidedAt, &t.CreatedAt)
	return t, err
}

func (s *pgStore) ListTransactions(ctx context.Context, f ListFilter) ([]Transaction, int, error) {
	where := ` WHERE t.umkm_id = $1 AND t.deleted_at IS NULL`
	args := []any{f.UMKMID}
	for _, c := range []struct{ expr, val string }{
		{"t.branch_id = $%d", f.BranchID},
		{"t.cashier_id = $%d", f.CashierID},
		{"t.payment_method = $%d", f.PaymentMethod},
		{"t.status = $%d", f.Status},
		{"t.business_date >= $%d::date", f.From},
		{"t.business_date <= $%d::date", f.To},
	} {
		if c.val != "" {
			args = append(args, c.val)
			where += " AND " + fmt.Sprintf(c.expr, len(args))
		}
	}

	var total int
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM transactions t`+where, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := s.db.QueryContext(ctx,
		txSelect+where+fmt.Sprintf(` ORDER BY t.business_date DESC, t.created_at DESC LIMIT $%d OFFSET $%d`, len(args)+1, len(args)+2),
		append(args, f.Limit, f.Offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	out := []Transaction{}
	for rows.Next() {
		t, err := scanTransaction(rows)
		if err != nil {
			return nil, 0, err
		}
		out = append(out, t)
	}
	return out, total, rows.Err()
}

func (s *pgStore) GetTransaction(ctx context.Context, umkmID, id string) (Transaction, error) {
	t, err := scanTransaction(s.db.QueryRowContext(ctx,
		txSelect+` WHERE t.id = $1 AND t.umkm_id = $2 AND t.deleted_at IS NULL`, id, umkmID))
	if errors.Is(err, sql.ErrNoRows) {
		return Transaction{}, ErrNotFound
	}
	if err != nil {
		return Transaction{}, err
	}

	rows, err := s.db.QueryContext(ctx, `
		SELECT id, product_id, product_name, price, qty, line_total
		FROM transaction_items
		WHERE transaction_id = $1 AND deleted_at IS NULL
		ORDER BY created_at ASC`, id)
	if err != nil {
		return Transaction{}, err
	}
	defer rows.Close()

	t.Items = []Item{}
	for rows.Next() {
		var it Item
		if err := rows.Scan(&it.ID, &it.ProductID, &it.ProductName, &it.Price, &it.Qty, &it.LineTotal); err != nil {
			return Transaction{}, err
		}
		t.Items = append(t.Items, it)
	}
	return t, rows.Err()
}
