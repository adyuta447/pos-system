package auth

import (
	"context"
	"database/sql"
	"errors"
)

var ErrNotFound = errors.New("not found")

// WebUser represents an authenticated web user record from web_users.
type WebUser struct {
	ID           string
	UMKMID       string
	BranchID     string
	Name         string
	Email        string
	PasswordHash string
	Role         string
	IsActive     bool
	UMKMActive   bool
	BranchActive bool
}

// Store defines persistence operations for the auth module.
type Store interface {
	FindByEmail(ctx context.Context, email string) (WebUser, error)
	FindByID(ctx context.Context, id string) (WebUser, error)
	UpdatePasswordHash(ctx context.Context, id, passwordHash string) error
}

type pgStore struct {
	db *sql.DB
}

func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

const selectUserQuery = `
SELECT
	u.id,
	COALESCE(u.umkm_id::text, ''),
	COALESCE(u.branch_id::text, ''),
	u.name,
	u.email,
	u.password_hash,
	u.role,
	u.is_active,
	COALESCE(m.is_active, true),
	COALESCE(b.is_active, true)
FROM web_users u
LEFT JOIN umkms m ON m.id = u.umkm_id AND m.deleted_at IS NULL
LEFT JOIN branches b ON b.id = u.branch_id AND b.deleted_at IS NULL
WHERE u.deleted_at IS NULL`

func (s *pgStore) FindByEmail(ctx context.Context, email string) (WebUser, error) {
	return scanUser(s.db.QueryRowContext(ctx, selectUserQuery+` AND LOWER(u.email) = LOWER($1)`, email))
}

func (s *pgStore) FindByID(ctx context.Context, id string) (WebUser, error) {
	return scanUser(s.db.QueryRowContext(ctx, selectUserQuery+` AND u.id = $1`, id))
}

func (s *pgStore) UpdatePasswordHash(ctx context.Context, id, passwordHash string) error {
	res, err := s.db.ExecContext(ctx,
		`UPDATE web_users SET password_hash = $1, updated_at = now() WHERE id = $2 AND deleted_at IS NULL`,
		passwordHash, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrNotFound
	}
	return nil
}

func scanUser(row *sql.Row) (WebUser, error) {
	var u WebUser
	err := row.Scan(
		&u.ID, &u.UMKMID, &u.BranchID, &u.Name, &u.Email,
		&u.PasswordHash, &u.Role, &u.IsActive, &u.UMKMActive, &u.BranchActive,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return WebUser{}, ErrNotFound
	}
	return u, err
}
