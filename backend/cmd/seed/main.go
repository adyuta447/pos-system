package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"log"

	"golang.org/x/crypto/bcrypt"

	"pos-system/backend/internal/platform/config"
	"pos-system/backend/internal/platform/db"
)

const (
	seedSuperadminID = "01900000-0000-7000-8000-000000000001"
	seedUMKMID       = "01900000-0000-7000-8000-000000000010"
	seedOwnerID      = "01900000-0000-7000-8000-000000000002"
	seedBranchID     = "01900000-0000-7000-8000-000000000020"
	seedSettingsID   = "01900000-0000-7000-8000-000000000021"
	seedBranchAdmID  = "01900000-0000-7000-8000-000000000003"
	seedStaffID      = "01900000-0000-7000-8000-000000000030"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	pwHash, err := bcrypt.GenerateFromPassword([]byte("secret123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash password: %v", err)
	}

	pinSum := sha256.Sum256([]byte("1234"))
	pinHash := hex.EncodeToString(pinSum[:])

	tx, err := pool.BeginTx(ctx, nil)
	if err != nil {
		log.Fatalf("begin tx: %v", err)
	}
	defer func() { _ = tx.Rollback() }()

	queries := []struct {
		query string
		args  []any
	}{
		{
			`INSERT INTO web_users (id, name, email, password_hash, role)
			 VALUES ($1, $2, $3, $4, 'superadmin') ON CONFLICT DO NOTHING`,
			[]any{seedSuperadminID, "Superadmin POS", "admin@posumkm.id", string(pwHash)},
		},
		{
			`INSERT INTO umkms (id, name, phone, address)
			 VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
			[]any{seedUMKMID, "Warung Maju Jaya", "08123456789", "Jl. Merdeka No. 10, Jakarta"},
		},
		{
			`INSERT INTO web_users (id, umkm_id, name, email, password_hash, role)
			 VALUES ($1, $2, $3, $4, $5, 'owner') ON CONFLICT DO NOTHING`,
			[]any{seedOwnerID, seedUMKMID, "Budi Owner", "owner@warung.id", string(pwHash)},
		},
		{
			`INSERT INTO branches (id, umkm_id, name, address, phone)
			 VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
			[]any{seedBranchID, seedUMKMID, "Cabang Sudirman", "Jl. Sudirman No. 5", "08129998887"},
		},
		{
			`INSERT INTO branch_settings (id, umkm_id, branch_id, setup_done, store_name, address, phone, receipt_footer)
			 VALUES ($1, $2, $3, true, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
			[]any{seedSettingsID, seedUMKMID, seedBranchID, "Warung Maju - Sudirman", "Jl. Sudirman No. 5", "08129998887", "Terima kasih telah berbelanja"},
		},
		{
			`INSERT INTO web_users (id, umkm_id, branch_id, name, email, password_hash, role)
			 VALUES ($1, $2, $3, $4, $5, $6, 'branch_admin') ON CONFLICT DO NOTHING`,
			[]any{seedBranchAdmID, seedUMKMID, seedBranchID, "Siti Admin Cabang", "branch@warung.id", string(pwHash)},
		},
		{
			`INSERT INTO branch_staff (id, umkm_id, branch_id, name, pin_hash, role)
			 VALUES ($1, $2, $3, $4, $5, 'cashier') ON CONFLICT DO NOTHING`,
			[]any{seedStaffID, seedUMKMID, seedBranchID, "Andi Kasir", pinHash},
		},
	}

	for _, q := range queries {
		if _, err := tx.ExecContext(ctx, q.query, q.args...); err != nil {
			log.Fatalf("seed failed: %v", err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("commit failed: %v", err)
	}

	log.Println("Seed complete:")
	log.Println("  Superadmin   : admin@posumkm.id / secret123")
	log.Println("  Owner        : owner@warung.id / secret123 (umkm_id=" + seedUMKMID + ")")
	log.Println("  Branch Admin : branch@warung.id / secret123 (branch_id=" + seedBranchID + ")")
	log.Println("  Tablet Staff : Andi Kasir (role=cashier, pin=1234, id=" + seedStaffID + ")")
}
