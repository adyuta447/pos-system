package attendance

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type Attendance struct {
	ID              string     `json:"id"`
	BranchID        string     `json:"branch_id"`
	BranchName      string     `json:"branch_name"`
	StaffID         string     `json:"staff_id"`
	StaffName       string     `json:"staff_name"`
	BusinessDate    string     `json:"business_date"`
	ClockInAt       time.Time  `json:"clock_in_at"`
	ClockOutAt      *time.Time `json:"clock_out_at"`
	DurationMinutes *int       `json:"duration_minutes"`
}

// ListFilter selects shifts by business_date; BranchID and StaffID are optional.
type ListFilter struct {
	UMKMID   string
	BranchID string
	StaffID  string
	From     string // YYYY-MM-DD, inclusive
	To       string // YYYY-MM-DD, inclusive
}

// Store defines persistence operations for the attendance module.
type Store interface {
	ListAttendances(ctx context.Context, f ListFilter) ([]Attendance, error)
}

type pgStore struct {
	db *sql.DB
}

func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

func (s *pgStore) ListAttendances(ctx context.Context, f ListFilter) ([]Attendance, error) {
	q := `
		SELECT a.id, a.branch_id, b.name, a.staff_id, s.name, to_char(a.business_date, 'YYYY-MM-DD'), a.clock_in_at, a.clock_out_at
		FROM attendances a
		JOIN branches b ON b.id = a.branch_id
		JOIN branch_staff s ON s.id = a.staff_id
		WHERE a.umkm_id = $1 AND a.business_date BETWEEN $2::date AND $3::date AND a.deleted_at IS NULL`
	args := []any{f.UMKMID, f.From, f.To}
	if f.BranchID != "" {
		args = append(args, f.BranchID)
		q += fmt.Sprintf(" AND a.branch_id = $%d", len(args))
	}
	if f.StaffID != "" {
		args = append(args, f.StaffID)
		q += fmt.Sprintf(" AND a.staff_id = $%d", len(args))
	}
	rows, err := s.db.QueryContext(ctx, q+` ORDER BY a.business_date DESC, a.clock_in_at DESC`, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Attendance{}
	for rows.Next() {
		var a Attendance
		if err := rows.Scan(&a.ID, &a.BranchID, &a.BranchName, &a.StaffID, &a.StaffName, &a.BusinessDate, &a.ClockInAt, &a.ClockOutAt); err != nil {
			return nil, err
		}
		if a.ClockOutAt != nil {
			mins := int(a.ClockOutAt.Sub(a.ClockInAt).Minutes())
			a.DurationMinutes = &mins
		}
		out = append(out, a)
	}
	return out, rows.Err()
}
