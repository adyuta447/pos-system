package umkm

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/google/uuid"
)

var (
	ErrNotFound = errors.New("not found")
	ErrConflict = errors.New("conflict")
)

type UMKM struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Phone       string `json:"phone"`
	Address     string `json:"address"`
	IsActive    bool   `json:"is_active"`
	BranchCount int    `json:"branch_count,omitempty"`
}

type Branch struct {
	ID       string `json:"id"`
	UMKMID   string `json:"umkm_id"`
	Name     string `json:"name"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
	IsActive bool   `json:"is_active"`
}

type BranchSettings struct {
	BranchID      string `json:"branch_id"`
	SetupDone     bool   `json:"setup_done"`
	StoreName     string `json:"store_name"`
	Address       string `json:"address"`
	Phone         string `json:"phone"`
	ReceiptHeader string `json:"receipt_header"`
	ReceiptFooter string `json:"receipt_footer"`
	LogoURL       string `json:"logo_url,omitempty"`
	QRISImageURL  string `json:"qris_image_url,omitempty"`
	ReceiptPrefix string `json:"receipt_prefix"`
	DailyReset    bool   `json:"daily_reset"`
	TaxEnabled    bool   `json:"tax_enabled"`
	TaxName       string `json:"tax_name"`
	TaxRateBP     int    `json:"tax_rate_bp"`
	TaxInclusive  bool   `json:"tax_inclusive"`
}

type Staff struct {
	ID       string `json:"id"`
	BranchID string `json:"branch_id"`
	Name     string `json:"name"`
	PhotoURL string `json:"photo_url,omitempty"`
	Role     string `json:"role"`
	IsActive bool   `json:"is_active"`
}

type CreateUMKMInput struct {
	Name              string
	Phone             string
	Address           string
	OwnerName         string
	OwnerEmail        string
	OwnerPasswordHash string
}

type CreateBranchWebUserInput struct {
	UMKMID       string
	BranchID     string
	Name         string
	Email        string
	PasswordHash string
}

type CreateStaffInput struct {
	UMKMID   string
	BranchID string
	Name     string
	Role     string
	PINHash  string
}

// Store defines persistence operations for the umkm module.
type Store interface {
	CreateUMKMWithOwner(ctx context.Context, in CreateUMKMInput) (UMKM, string, error)
	ListUMKMs(ctx context.Context) ([]UMKM, error)
	GetUMKM(ctx context.Context, id string) (UMKM, error)
	SetUMKMStatus(ctx context.Context, id string, active bool) error

	CreateBranch(ctx context.Context, umkmID, name, address, phone string) (Branch, error)
	ListBranches(ctx context.Context, umkmID string) ([]Branch, error)
	GetBranch(ctx context.Context, umkmID, branchID string) (Branch, error)
	UpdateBranch(ctx context.Context, umkmID, branchID, name, address, phone string, isActive *bool) (Branch, error)

	GetBranchSettings(ctx context.Context, umkmID, branchID string) (BranchSettings, error)
	UpsertBranchSettings(ctx context.Context, umkmID string, s BranchSettings) (BranchSettings, error)

	CreateBranchWebUser(ctx context.Context, in CreateBranchWebUserInput) (string, error)
	CreateStaff(ctx context.Context, in CreateStaffInput) (Staff, error)
	ListStaff(ctx context.Context, umkmID, branchID string) ([]Staff, error)
	UpdateStaffPIN(ctx context.Context, umkmID, branchID, staffID, pinHash string) error
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

func isUniqueViolation(err error) bool {
	return err != nil && (strings.Contains(err.Error(), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key"))
}

func (s *pgStore) CreateUMKMWithOwner(ctx context.Context, in CreateUMKMInput) (UMKM, string, error) {
	umkmID, err := newID()
	if err != nil {
		return UMKM{}, "", err
	}
	ownerID, err := newID()
	if err != nil {
		return UMKM{}, "", err
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return UMKM{}, "", err
	}
	defer func() { _ = tx.Rollback() }()

	_, err = tx.ExecContext(ctx,
		`INSERT INTO umkms (id, name, phone, address) VALUES ($1, $2, $3, $4)`,
		umkmID, in.Name, in.Phone, in.Address,
	)
	if err != nil {
		return UMKM{}, "", err
	}

	_, err = tx.ExecContext(ctx,
		`INSERT INTO web_users (id, umkm_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5, 'owner')`,
		ownerID, umkmID, in.OwnerName, in.OwnerEmail, in.OwnerPasswordHash,
	)
	if isUniqueViolation(err) {
		return UMKM{}, "", ErrConflict
	}
	if err != nil {
		return UMKM{}, "", err
	}

	if err := tx.Commit(); err != nil {
		return UMKM{}, "", err
	}
	return UMKM{ID: umkmID, Name: in.Name, Phone: in.Phone, Address: in.Address, IsActive: true}, ownerID, nil
}

func (s *pgStore) ListUMKMs(ctx context.Context) ([]UMKM, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT m.id, m.name, COALESCE(m.phone, ''), COALESCE(m.address, ''), m.is_active, COUNT(b.id)
		FROM umkms m
		LEFT JOIN branches b ON b.umkm_id = m.id AND b.deleted_at IS NULL
		WHERE m.deleted_at IS NULL
		GROUP BY m.id
		ORDER BY m.created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []UMKM{}
	for rows.Next() {
		var u UMKM
		if err := rows.Scan(&u.ID, &u.Name, &u.Phone, &u.Address, &u.IsActive, &u.BranchCount); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

func (s *pgStore) GetUMKM(ctx context.Context, id string) (UMKM, error) {
	var u UMKM
	err := s.db.QueryRowContext(ctx, `
		SELECT m.id, m.name, COALESCE(m.phone, ''), COALESCE(m.address, ''), m.is_active, COUNT(b.id)
		FROM umkms m
		LEFT JOIN branches b ON b.umkm_id = m.id AND b.deleted_at IS NULL
		WHERE m.id = $1 AND m.deleted_at IS NULL
		GROUP BY m.id`, id,
	).Scan(&u.ID, &u.Name, &u.Phone, &u.Address, &u.IsActive, &u.BranchCount)
	if errors.Is(err, sql.ErrNoRows) {
		return UMKM{}, ErrNotFound
	}
	return u, err
}

func (s *pgStore) SetUMKMStatus(ctx context.Context, id string, active bool) error {
	res, err := s.db.ExecContext(ctx,
		`UPDATE umkms SET is_active = $1, updated_at = now() WHERE id = $2 AND deleted_at IS NULL`,
		active, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *pgStore) CreateBranch(ctx context.Context, umkmID, name, address, phone string) (Branch, error) {
	branchID, err := newID()
	if err != nil {
		return Branch{}, err
	}
	settingsID, err := newID()
	if err != nil {
		return Branch{}, err
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return Branch{}, err
	}
	defer func() { _ = tx.Rollback() }()

	_, err = tx.ExecContext(ctx,
		`INSERT INTO branches (id, umkm_id, name, address, phone) VALUES ($1, $2, $3, $4, $5)`,
		branchID, umkmID, name, address, phone,
	)
	if err != nil {
		return Branch{}, err
	}

	_, err = tx.ExecContext(ctx,
		`INSERT INTO branch_settings (id, umkm_id, branch_id, store_name, address, phone) VALUES ($1, $2, $3, $4, $5, $6)`,
		settingsID, umkmID, branchID, name, address, phone,
	)
	if err != nil {
		return Branch{}, err
	}

	if err := tx.Commit(); err != nil {
		return Branch{}, err
	}
	return Branch{ID: branchID, UMKMID: umkmID, Name: name, Address: address, Phone: phone, IsActive: true}, nil
}

func (s *pgStore) ListBranches(ctx context.Context, umkmID string) ([]Branch, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, umkm_id, name, COALESCE(address, ''), COALESCE(phone, ''), is_active
		 FROM branches WHERE umkm_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
		umkmID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Branch{}
	for rows.Next() {
		var b Branch
		if err := rows.Scan(&b.ID, &b.UMKMID, &b.Name, &b.Address, &b.Phone, &b.IsActive); err != nil {
			return nil, err
		}
		out = append(out, b)
	}
	return out, rows.Err()
}

func (s *pgStore) GetBranch(ctx context.Context, umkmID, branchID string) (Branch, error) {
	var b Branch
	err := s.db.QueryRowContext(ctx,
		`SELECT id, umkm_id, name, COALESCE(address, ''), COALESCE(phone, ''), is_active
		 FROM branches WHERE id = $1 AND umkm_id = $2 AND deleted_at IS NULL`,
		branchID, umkmID,
	).Scan(&b.ID, &b.UMKMID, &b.Name, &b.Address, &b.Phone, &b.IsActive)
	if errors.Is(err, sql.ErrNoRows) {
		return Branch{}, ErrNotFound
	}
	return b, err
}

func (s *pgStore) UpdateBranch(ctx context.Context, umkmID, branchID, name, address, phone string, isActive *bool) (Branch, error) {
	b, err := s.GetBranch(ctx, umkmID, branchID)
	if err != nil {
		return Branch{}, err
	}
	if name != "" {
		b.Name = name
	}
	if address != "" {
		b.Address = address
	}
	if phone != "" {
		b.Phone = phone
	}
	if isActive != nil {
		b.IsActive = *isActive
	}

	_, err = s.db.ExecContext(ctx,
		`UPDATE branches SET name = $1, address = $2, phone = $3, is_active = $4, updated_at = now()
		 WHERE id = $5 AND umkm_id = $6 AND deleted_at IS NULL`,
		b.Name, b.Address, b.Phone, b.IsActive, branchID, umkmID,
	)
	return b, err
}

func (s *pgStore) GetBranchSettings(ctx context.Context, umkmID, branchID string) (BranchSettings, error) {
	var st BranchSettings
	err := s.db.QueryRowContext(ctx, `
		SELECT branch_id, setup_done, store_name, address, phone, receipt_header, receipt_footer,
		       COALESCE(logo_url, ''), COALESCE(qris_image_url, ''), receipt_prefix, daily_reset,
		       tax_enabled, tax_name, tax_rate_bp, tax_inclusive
		FROM branch_settings
		WHERE branch_id = $1 AND umkm_id = $2 AND deleted_at IS NULL`,
		branchID, umkmID,
	).Scan(
		&st.BranchID, &st.SetupDone, &st.StoreName, &st.Address, &st.Phone, &st.ReceiptHeader, &st.ReceiptFooter,
		&st.LogoURL, &st.QRISImageURL, &st.ReceiptPrefix, &st.DailyReset,
		&st.TaxEnabled, &st.TaxName, &st.TaxRateBP, &st.TaxInclusive,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return BranchSettings{}, ErrNotFound
	}
	return st, err
}

func (s *pgStore) UpsertBranchSettings(ctx context.Context, umkmID string, st BranchSettings) (BranchSettings, error) {
	if _, err := s.GetBranch(ctx, umkmID, st.BranchID); err != nil {
		return BranchSettings{}, err
	}
	res, err := s.db.ExecContext(ctx, `
		UPDATE branch_settings
		SET setup_done = $1, store_name = $2, address = $3, phone = $4,
		    receipt_header = $5, receipt_footer = $6, logo_url = NULLIF($7, ''), qris_image_url = NULLIF($8, ''),
		    receipt_prefix = $9, daily_reset = $10, tax_enabled = $11, tax_name = $12,
		    tax_rate_bp = $13, tax_inclusive = $14, updated_at = now()
		WHERE branch_id = $15 AND umkm_id = $16 AND deleted_at IS NULL`,
		st.SetupDone, st.StoreName, st.Address, st.Phone,
		st.ReceiptHeader, st.ReceiptFooter, st.LogoURL, st.QRISImageURL,
		st.ReceiptPrefix, st.DailyReset, st.TaxEnabled, st.TaxName,
		st.TaxRateBP, st.TaxInclusive, st.BranchID, umkmID,
	)
	if err != nil {
		return BranchSettings{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return BranchSettings{}, ErrNotFound
	}
	return st, nil
}

func (s *pgStore) CreateBranchWebUser(ctx context.Context, in CreateBranchWebUserInput) (string, error) {
	if _, err := s.GetBranch(ctx, in.UMKMID, in.BranchID); err != nil {
		return "", err
	}
	id, err := newID()
	if err != nil {
		return "", err
	}
	_, err = s.db.ExecContext(ctx,
		`INSERT INTO web_users (id, umkm_id, branch_id, name, email, password_hash, role)
		 VALUES ($1, $2, $3, $4, $5, $6, 'branch_admin')`,
		id, in.UMKMID, in.BranchID, in.Name, in.Email, in.PasswordHash,
	)
	if isUniqueViolation(err) {
		return "", ErrConflict
	}
	return id, err
}

func (s *pgStore) CreateStaff(ctx context.Context, in CreateStaffInput) (Staff, error) {
	if _, err := s.GetBranch(ctx, in.UMKMID, in.BranchID); err != nil {
		return Staff{}, err
	}
	id, err := newID()
	if err != nil {
		return Staff{}, err
	}
	_, err = s.db.ExecContext(ctx,
		`INSERT INTO branch_staff (id, umkm_id, branch_id, name, pin_hash, role)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		id, in.UMKMID, in.BranchID, in.Name, in.PINHash, in.Role,
	)
	if isUniqueViolation(err) {
		return Staff{}, ErrConflict
	}
	if err != nil {
		return Staff{}, err
	}
	return Staff{ID: id, BranchID: in.BranchID, Name: in.Name, Role: in.Role, IsActive: true}, nil
}

func (s *pgStore) ListStaff(ctx context.Context, umkmID, branchID string) ([]Staff, error) {
	if _, err := s.GetBranch(ctx, umkmID, branchID); err != nil {
		return nil, err
	}
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, branch_id, name, COALESCE(photo_url, ''), role, is_active
		 FROM branch_staff WHERE branch_id = $1 AND umkm_id = $2 AND deleted_at IS NULL ORDER BY created_at ASC`,
		branchID, umkmID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Staff{}
	for rows.Next() {
		var st Staff
		if err := rows.Scan(&st.ID, &st.BranchID, &st.Name, &st.PhotoURL, &st.Role, &st.IsActive); err != nil {
			return nil, err
		}
		out = append(out, st)
	}
	return out, rows.Err()
}

func (s *pgStore) UpdateStaffPIN(ctx context.Context, umkmID, branchID, staffID, pinHash string) error {
	res, err := s.db.ExecContext(ctx,
		`UPDATE branch_staff SET pin_hash = $1, updated_at = now()
		 WHERE id = $2 AND branch_id = $3 AND umkm_id = $4 AND deleted_at IS NULL`,
		pinHash, staffID, branchID, umkmID,
	)
	if isUniqueViolation(err) {
		return ErrConflict
	}
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrNotFound
	}
	return nil
}
