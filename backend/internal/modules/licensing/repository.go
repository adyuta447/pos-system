package licensing

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

var (
	ErrNotFound     = errors.New("not found")
	ErrInvalidState = errors.New("invalid state")
)

type Subscription struct {
	ID              string     `json:"id"`
	UMKMID          string     `json:"umkm_id"`
	UMKMName        string     `json:"umkm_name,omitempty"`
	BranchID        string     `json:"branch_id"`
	BranchName      string     `json:"branch_name,omitempty"`
	Amount          int        `json:"amount"`
	PaymentMethod   string     `json:"payment_method"`
	PaymentProofURL string     `json:"payment_proof_url"`
	Status          string     `json:"status"`
	ConfirmedAt     *time.Time `json:"confirmed_at"`
	Notes           string     `json:"notes"`
	CreatedAt       time.Time  `json:"created_at"`
}

type License struct {
	ID             string     `json:"id"`
	UMKMID         string     `json:"umkm_id"`
	BranchID       string     `json:"branch_id"`
	SubscriptionID string     `json:"subscription_transaction_id"`
	LicenseKey     string     `json:"license_key"`
	Status         string     `json:"status"`
	DurationDays   int        `json:"duration_days"`
	ActivatedAt    *time.Time `json:"activated_at"`
	ExpiresAt      *time.Time `json:"expires_at"`
	CreatedAt      time.Time  `json:"created_at"`
}

type Notification struct {
	ID        string     `json:"id"`
	BranchID  string     `json:"branch_id"`
	Title     string     `json:"title"`
	Message   string     `json:"message"`
	SentAt    *time.Time `json:"sent_at"`
	ReadAt    *time.Time `json:"read_at"`
	CreatedAt time.Time  `json:"created_at"`
}

type CreateSubscriptionInput struct {
	UMKMID          string
	BranchID        string
	PaymentMethod   string
	PaymentProofURL string
	Notes           string
}

// Filter narrows list queries; empty fields are ignored.
type Filter struct {
	UMKMID   string
	BranchID string
	Status   string
}

// Store defines persistence operations for the licensing module.
type Store interface {
	CreateSubscription(ctx context.Context, in CreateSubscriptionInput) (Subscription, error)
	ListSubscriptions(ctx context.Context, f Filter) ([]Subscription, error)
	// ConfirmSubscription marks a pending payment confirmed and issues its license key in one transaction.
	ConfirmSubscription(ctx context.Context, id, adminID, notes, licenseKey string, durationDays int) (License, error)
	RejectSubscription(ctx context.Context, id, adminID, notes string) error

	ListLicenses(ctx context.Context, f Filter) ([]License, error)
	RevokeLicense(ctx context.Context, id string) error
	// ActivateLicense uses an unused key of the branch and extends the branch's active period.
	ActivateLicense(ctx context.Context, umkmID, branchID, licenseKey string) (License, error)

	ListNotifications(ctx context.Context, umkmID string) ([]Notification, error)
	MarkNotificationRead(ctx context.Context, umkmID, id string) error
}

type pgStore struct {
	db *sql.DB
}

func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

func newID() (string, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return "", err
	}
	return id.String(), nil
}

// An active license past expires_at is reported as expired; no job rewrites the stored status.
const licenseColumns = `id, umkm_id, branch_id, subscription_transaction_id, license_key,
	CASE WHEN status = 'active' AND expires_at < now() THEN 'expired' ELSE status END,
	duration_days, activated_at, expires_at, created_at`

func scanLicense(row interface{ Scan(...any) error }) (License, error) {
	var l License
	err := row.Scan(&l.ID, &l.UMKMID, &l.BranchID, &l.SubscriptionID, &l.LicenseKey,
		&l.Status, &l.DurationDays, &l.ActivatedAt, &l.ExpiresAt, &l.CreatedAt)
	return l, err
}

// stateErr tells a missing row apart from a row in the wrong state after a guarded UPDATE matched nothing.
func (s *pgStore) stateErr(ctx context.Context, q *sql.Tx, query string, args ...any) error {
	var exists bool
	if err := q.QueryRowContext(ctx, query, args...).Scan(&exists); err != nil {
		return err
	}
	if exists {
		return ErrInvalidState
	}
	return ErrNotFound
}

func (s *pgStore) CreateSubscription(ctx context.Context, in CreateSubscriptionInput) (Subscription, error) {
	id, err := newID()
	if err != nil {
		return Subscription{}, err
	}
	var sub Subscription
	err = s.db.QueryRowContext(ctx, `
		INSERT INTO subscription_transactions (id, umkm_id, branch_id, payment_method, payment_proof_url, notes)
		SELECT $1, b.umkm_id, b.id, NULLIF($2, ''), NULLIF($3, ''), NULLIF($4, '')
		FROM branches b WHERE b.id = $5 AND b.umkm_id = $6 AND b.deleted_at IS NULL
		RETURNING id, umkm_id, branch_id, amount, status, created_at`,
		id, in.PaymentMethod, in.PaymentProofURL, in.Notes, in.BranchID, in.UMKMID,
	).Scan(&sub.ID, &sub.UMKMID, &sub.BranchID, &sub.Amount, &sub.Status, &sub.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return Subscription{}, ErrNotFound
	}
	sub.PaymentMethod, sub.PaymentProofURL, sub.Notes = in.PaymentMethod, in.PaymentProofURL, in.Notes
	return sub, err
}

func (s *pgStore) ListSubscriptions(ctx context.Context, f Filter) ([]Subscription, error) {
	q := `
		SELECT t.id, t.umkm_id, m.name, t.branch_id, b.name, t.amount, COALESCE(t.payment_method, ''),
		       COALESCE(t.payment_proof_url, ''), t.status, t.confirmed_at, COALESCE(t.notes, ''), t.created_at
		FROM subscription_transactions t
		JOIN umkms m ON m.id = t.umkm_id
		JOIN branches b ON b.id = t.branch_id
		WHERE t.deleted_at IS NULL`
	var args []any
	q, args = applyFilter(q, args, "t", f)
	rows, err := s.db.QueryContext(ctx, q+` ORDER BY t.created_at DESC`, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Subscription{}
	for rows.Next() {
		var sub Subscription
		if err := rows.Scan(&sub.ID, &sub.UMKMID, &sub.UMKMName, &sub.BranchID, &sub.BranchName, &sub.Amount, &sub.PaymentMethod,
			&sub.PaymentProofURL, &sub.Status, &sub.ConfirmedAt, &sub.Notes, &sub.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, sub)
	}
	return out, rows.Err()
}

func applyFilter(q string, args []any, alias string, f Filter) (string, []any) {
	for col, val := range map[string]string{"umkm_id": f.UMKMID, "branch_id": f.BranchID, "status": f.Status} {
		if val != "" {
			args = append(args, val)
			q += fmt.Sprintf(" AND %s.%s = $%d", alias, col, len(args))
		}
	}
	return q, args
}

func (s *pgStore) ConfirmSubscription(ctx context.Context, id, adminID, notes, licenseKey string, durationDays int) (License, error) {
	licenseID, err := newID()
	if err != nil {
		return License{}, err
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return License{}, err
	}
	defer func() { _ = tx.Rollback() }()

	var umkmID, branchID string
	err = tx.QueryRowContext(ctx, `
		UPDATE subscription_transactions
		SET status = 'confirmed', confirmed_by = $1, confirmed_at = now(), notes = COALESCE(NULLIF($2, ''), notes), updated_at = now()
		WHERE id = $3 AND status = 'pending' AND deleted_at IS NULL
		RETURNING umkm_id, branch_id`,
		adminID, notes, id,
	).Scan(&umkmID, &branchID)
	if errors.Is(err, sql.ErrNoRows) {
		return License{}, s.stateErr(ctx, tx, `SELECT EXISTS (SELECT 1 FROM subscription_transactions WHERE id = $1 AND deleted_at IS NULL)`, id)
	}
	if err != nil {
		return License{}, err
	}

	l, err := scanLicense(tx.QueryRowContext(ctx, `
		INSERT INTO branch_licenses (id, umkm_id, branch_id, subscription_transaction_id, license_key, duration_days, issued_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING `+licenseColumns,
		licenseID, umkmID, branchID, id, licenseKey, durationDays, adminID,
	))
	if err != nil {
		return License{}, err
	}
	return l, tx.Commit()
}

func (s *pgStore) RejectSubscription(ctx context.Context, id, adminID, notes string) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	res, err := tx.ExecContext(ctx, `
		UPDATE subscription_transactions
		SET status = 'rejected', confirmed_by = $1, confirmed_at = now(), notes = $2, updated_at = now()
		WHERE id = $3 AND status = 'pending' AND deleted_at IS NULL`,
		adminID, notes, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return s.stateErr(ctx, tx, `SELECT EXISTS (SELECT 1 FROM subscription_transactions WHERE id = $1 AND deleted_at IS NULL)`, id)
	}
	return tx.Commit()
}

func (s *pgStore) ListLicenses(ctx context.Context, f Filter) ([]License, error) {
	q := `SELECT ` + licenseColumns + ` FROM branch_licenses l WHERE l.deleted_at IS NULL`
	var args []any
	status := f.Status
	f.Status = "" // status is derived (see licenseColumns), so filter it after scanning
	q, args = applyFilter(q, args, "l", f)
	rows, err := s.db.QueryContext(ctx, q+` ORDER BY l.created_at DESC`, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []License{}
	for rows.Next() {
		l, err := scanLicense(rows)
		if err != nil {
			return nil, err
		}
		if status == "" || l.Status == status {
			out = append(out, l)
		}
	}
	return out, rows.Err()
}

func (s *pgStore) RevokeLicense(ctx context.Context, id string) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	res, err := tx.ExecContext(ctx, `
		UPDATE branch_licenses SET status = 'revoked', updated_at = now()
		WHERE id = $1 AND status IN ('unused', 'active') AND deleted_at IS NULL`, id)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return s.stateErr(ctx, tx, `SELECT EXISTS (SELECT 1 FROM branch_licenses WHERE id = $1 AND deleted_at IS NULL)`, id)
	}
	return tx.Commit()
}

func (s *pgStore) ActivateLicense(ctx context.Context, umkmID, branchID, licenseKey string) (License, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return License{}, err
	}
	defer func() { _ = tx.Rollback() }()

	// Lock the branch so two keys activated at once cannot both extend from the same expiry.
	var locked string
	err = tx.QueryRowContext(ctx,
		`SELECT id FROM branches WHERE id = $1 AND umkm_id = $2 AND deleted_at IS NULL FOR UPDATE`,
		branchID, umkmID,
	).Scan(&locked)
	if errors.Is(err, sql.ErrNoRows) {
		return License{}, ErrNotFound
	}
	if err != nil {
		return License{}, err
	}

	// The new period starts when the current one ends, so paying early never loses days.
	l, err := scanLicense(tx.QueryRowContext(ctx, `
		UPDATE branch_licenses
		SET status = 'active', activated_at = now(), updated_at = now(),
		    expires_at = GREATEST(now(), COALESCE((
		        SELECT MAX(expires_at) FROM branch_licenses
		        WHERE branch_id = $2 AND status = 'active' AND deleted_at IS NULL), now())) + make_interval(days => duration_days)
		WHERE license_key = $1 AND branch_id = $2 AND status = 'unused' AND deleted_at IS NULL
		RETURNING `+licenseColumns,
		licenseKey, branchID,
	))
	if errors.Is(err, sql.ErrNoRows) {
		return License{}, s.stateErr(ctx, tx,
			`SELECT EXISTS (SELECT 1 FROM branch_licenses WHERE license_key = $1 AND branch_id = $2 AND deleted_at IS NULL)`,
			licenseKey, branchID)
	}
	if err != nil {
		return License{}, err
	}
	return l, tx.Commit()
}

func (s *pgStore) ListNotifications(ctx context.Context, umkmID string) ([]Notification, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, COALESCE(branch_id::text, ''), title, message, sent_at, read_at, created_at
		FROM notifications
		WHERE umkm_id = $1 AND channel = 'web' AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT 100`, umkmID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Notification{}
	for rows.Next() {
		var n Notification
		if err := rows.Scan(&n.ID, &n.BranchID, &n.Title, &n.Message, &n.SentAt, &n.ReadAt, &n.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

func (s *pgStore) MarkNotificationRead(ctx context.Context, umkmID, id string) error {
	res, err := s.db.ExecContext(ctx, `
		UPDATE notifications SET read_at = COALESCE(read_at, now()), updated_at = now()
		WHERE id = $1 AND umkm_id = $2 AND channel = 'web' AND deleted_at IS NULL`, id, umkmID)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrNotFound
	}
	return nil
}
