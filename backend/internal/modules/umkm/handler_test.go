package umkm

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

type memStore struct {
	umkms    map[string]UMKM
	emails   map[string]bool
	branches map[string]Branch
	settings map[string]BranchSettings
	staff    map[string]Staff
	pins     map[string]bool
	seq      int
}

func newMemStore() *memStore {
	return &memStore{
		umkms:    map[string]UMKM{},
		emails:   map[string]bool{},
		branches: map[string]Branch{},
		settings: map[string]BranchSettings{},
		staff:    map[string]Staff{},
		pins:     map[string]bool{},
	}
}

func (m *memStore) nextID(prefix string) string {
	m.seq++
	return fmt.Sprintf("%s-%d", prefix, m.seq)
}

func (m *memStore) CreateUMKMWithOwner(_ context.Context, in CreateUMKMInput) (UMKM, string, error) {
	if m.emails[in.OwnerEmail] {
		return UMKM{}, "", ErrConflict
	}
	m.emails[in.OwnerEmail] = true
	id := m.nextID("umkm")
	u := UMKM{ID: id, Name: in.Name, Phone: in.Phone, Address: in.Address, IsActive: true}
	m.umkms[id] = u
	return u, m.nextID("user"), nil
}

func (m *memStore) ListUMKMs(_ context.Context) ([]UMKM, error) {
	out := make([]UMKM, 0, len(m.umkms))
	for _, u := range m.umkms {
		out = append(out, u)
	}
	return out, nil
}

func (m *memStore) GetUMKM(_ context.Context, id string) (UMKM, error) {
	u, ok := m.umkms[id]
	if !ok {
		return UMKM{}, ErrNotFound
	}
	return u, nil
}

func (m *memStore) SetUMKMStatus(_ context.Context, id string, active bool) error {
	u, ok := m.umkms[id]
	if !ok {
		return ErrNotFound
	}
	u.IsActive = active
	m.umkms[id] = u
	return nil
}

func (m *memStore) CreateBranch(_ context.Context, umkmID, name, address, phone string) (Branch, error) {
	id := m.nextID("branch")
	b := Branch{ID: id, UMKMID: umkmID, Name: name, Address: address, Phone: phone, IsActive: true}
	m.branches[id] = b
	m.settings[id] = BranchSettings{BranchID: id, StoreName: name, ReceiptPrefix: "INV", DailyReset: true, TaxName: "PPN", TaxRateBP: 1100}
	return b, nil
}

func (m *memStore) ListBranches(_ context.Context, umkmID string) ([]Branch, error) {
	var out []Branch
	for _, b := range m.branches {
		if b.UMKMID == umkmID {
			out = append(out, b)
		}
	}
	return out, nil
}

func (m *memStore) GetBranch(_ context.Context, umkmID, branchID string) (Branch, error) {
	b, ok := m.branches[branchID]
	if !ok || b.UMKMID != umkmID {
		return Branch{}, ErrNotFound
	}
	return b, nil
}

func (m *memStore) UpdateBranch(ctx context.Context, umkmID, branchID, name, address, phone string, isActive *bool) (Branch, error) {
	b, err := m.GetBranch(ctx, umkmID, branchID)
	if err != nil {
		return Branch{}, err
	}
	if name != "" {
		b.Name = name
	}
	if isActive != nil {
		b.IsActive = *isActive
	}
	m.branches[branchID] = b
	return b, nil
}

func (m *memStore) GetBranchSettings(ctx context.Context, umkmID, branchID string) (BranchSettings, error) {
	if _, err := m.GetBranch(ctx, umkmID, branchID); err != nil {
		return BranchSettings{}, err
	}
	return m.settings[branchID], nil
}

func (m *memStore) UpsertBranchSettings(ctx context.Context, umkmID string, s BranchSettings) (BranchSettings, error) {
	if _, err := m.GetBranch(ctx, umkmID, s.BranchID); err != nil {
		return BranchSettings{}, err
	}
	m.settings[s.BranchID] = s
	return s, nil
}

func (m *memStore) CreateBranchWebUser(ctx context.Context, in CreateBranchWebUserInput) (string, error) {
	if _, err := m.GetBranch(ctx, in.UMKMID, in.BranchID); err != nil {
		return "", err
	}
	if m.emails[in.Email] {
		return "", ErrConflict
	}
	m.emails[in.Email] = true
	return m.nextID("web"), nil
}

func (m *memStore) CreateStaff(ctx context.Context, in CreateStaffInput) (Staff, error) {
	if _, err := m.GetBranch(ctx, in.UMKMID, in.BranchID); err != nil {
		return Staff{}, err
	}
	key := in.BranchID + ":" + in.PINHash
	if m.pins[key] {
		return Staff{}, ErrConflict
	}
	m.pins[key] = true
	id := m.nextID("staff")
	st := Staff{ID: id, BranchID: in.BranchID, Name: in.Name, Role: in.Role, IsActive: true}
	m.staff[id] = st
	return st, nil
}

func (m *memStore) ListStaff(ctx context.Context, umkmID, branchID string) ([]Staff, error) {
	if _, err := m.GetBranch(ctx, umkmID, branchID); err != nil {
		return nil, err
	}
	var out []Staff
	for _, st := range m.staff {
		if st.BranchID == branchID {
			out = append(out, st)
		}
	}
	return out, nil
}

func (m *memStore) UpdateStaff(_ context.Context, umkmID, branchID, staffID, name, role string, isActive *bool) (Staff, error) {
	b, ok := m.branches[branchID]
	st, found := m.staff[staffID]
	if !ok || b.UMKMID != umkmID || !found || st.BranchID != branchID {
		return Staff{}, ErrNotFound
	}
	if name != "" {
		st.Name = name
	}
	if role != "" {
		st.Role = role
	}
	if isActive != nil {
		st.IsActive = *isActive
	}
	m.staff[staffID] = st
	return st, nil
}

func (m *memStore) UpdateStaffPIN(_ context.Context, umkmID, branchID, staffID, pinHash string) error {
	b, ok := m.branches[branchID]
	if !ok || b.UMKMID != umkmID {
		return ErrNotFound
	}
	if _, ok := m.staff[staffID]; !ok {
		return ErrNotFound
	}
	key := branchID + ":" + pinHash
	if m.pins[key] {
		return ErrConflict
	}
	m.pins[key] = true
	return nil
}

func setupUMKMTest(t *testing.T) (*gin.Engine, *memStore, string) {
	t.Helper()
	gin.SetMode(gin.TestMode)
	secret := "test-secret"
	store := newMemStore()
	r := gin.New()
	NewModule(store, secret).RegisterRoutes(r.Group("/api/v1"))
	return r, store, secret
}

func tok(t *testing.T, secret string, c authctx.Claims) string {
	t.Helper()
	s, err := authctx.GenerateToken(secret, c, time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	return s
}

func TestSuperadminCreateUMKM(t *testing.T) {
	r, _, secret := setupUMKMTest(t)
	adminTok := tok(t, secret, authctx.Claims{UserID: "sa-1", Role: "superadmin"})
	ownerTok := tok(t, secret, authctx.Claims{UserID: "o-1", UMKMID: "m-1", Role: "owner"})

	body := `{"name":"Warung Maju","owner_name":"Budi","owner_email":"budi@maju.id","owner_password":"secret123"}`

	// Owner forbidden -> 403
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/v1/admin/umkms", bytes.NewBufferString(body))
	req.Header.Set("Authorization", "Bearer "+ownerTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", rec.Code)
	}

	// Superadmin creates -> 201
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/admin/umkms", bytes.NewBufferString(body))
	req.Header.Set("Authorization", "Bearer "+adminTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	// Duplicate email -> 409
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/admin/umkms", bytes.NewBufferString(body))
	req.Header.Set("Authorization", "Bearer "+adminTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409, got %d", rec.Code)
	}

	// Superadmin GET /admin/umkms/umkm-1 -> 200
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/api/v1/admin/umkms/umkm-1", nil)
	req.Header.Set("Authorization", "Bearer "+adminTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on superadmin get umkm, got %d", rec.Code)
	}

	// Owner GET /umkm -> 200
	ownerOfUMKM1 := tok(t, secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"})
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/api/v1/umkm", nil)
	req.Header.Set("Authorization", "Bearer "+ownerOfUMKM1)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on owner get my umkm, got %d", rec.Code)
	}
}

func TestOwnerBranchSettingsAndStaff(t *testing.T) {
	r, store, secret := setupUMKMTest(t)
	_, _ = store.CreateBranch(context.Background(), "umkm-1", "Cabang 1", "Jl. Merdeka", "0812")
	_, _ = store.CreateBranch(context.Background(), "umkm-2", "Cabang Lain", "Jl. Lain", "0813")

	owner1 := tok(t, secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"})
	branchAdmin1 := tok(t, secret, authctx.Claims{UserID: "ba-1", UMKMID: "umkm-1", BranchID: "branch-1", Role: "branch_admin"})

	// Owner 1 cannot access umkm-2's branch -> 404
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/branches/branch-2/settings", nil)
	req.Header.Set("Authorization", "Bearer "+owner1)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for cross-tenant branch, got %d", rec.Code)
	}

	// Branch admin can read own branch settings -> 200
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/api/v1/branches/branch-1/settings", nil)
	req.Header.Set("Authorization", "Bearer "+branchAdmin1)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	// Owner creates staff with PIN -> 201, duplicate PIN -> 409
	staffBody := `{"name":"Andi","role":"cashier","pin":"1234"}`
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/branches/branch-1/staff", bytes.NewBufferString(staffBody))
	req.Header.Set("Authorization", "Bearer "+owner1)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/branches/branch-1/staff", bytes.NewBufferString(staffBody))
	req.Header.Set("Authorization", "Bearer "+owner1)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 on duplicate PIN, got %d", rec.Code)
	}

	// Owner deactivates staff -> 200, invalid role -> 400, foreign branch -> 404
	for _, tc := range []struct {
		path, body string
		want       int
	}{
		{"/api/v1/branches/branch-1/staff/staff-3", `{"is_active":false}`, http.StatusOK},
		{"/api/v1/branches/branch-1/staff/staff-3", `{"role":"owner"}`, http.StatusUnprocessableEntity},
		{"/api/v1/branches/branch-2/staff/staff-3", `{"is_active":false}`, http.StatusNotFound},
	} {
		rec = httptest.NewRecorder()
		req = httptest.NewRequest(http.MethodPatch, tc.path, bytes.NewBufferString(tc.body))
		req.Header.Set("Authorization", "Bearer "+owner1)
		r.ServeHTTP(rec, req)
		if rec.Code != tc.want {
			t.Fatalf("PATCH %s %s: expected %d, got %d", tc.path, tc.body, tc.want, rec.Code)
		}
	}
	if store.staff["staff-3"].IsActive {
		t.Fatal("expected staff-3 to be deactivated")
	}
}

func TestSuperadminListUMKMBranches(t *testing.T) {
	r, store, secret := setupUMKMTest(t)
	store.umkms["umkm-1"] = UMKM{ID: "umkm-1", Name: "Warung", IsActive: true}
	_, _ = store.CreateBranch(context.Background(), "umkm-1", "Cabang 1", "", "")
	adminTok := tok(t, secret, authctx.Claims{UserID: "sa-1", Role: "superadmin"})

	for path, want := range map[string]int{
		"/api/v1/admin/umkms/umkm-1/branches":  http.StatusOK,
		"/api/v1/admin/umkms/missing/branches": http.StatusNotFound,
	} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, path, nil)
		req.Header.Set("Authorization", "Bearer "+adminTok)
		r.ServeHTTP(rec, req)
		if rec.Code != want {
			t.Fatalf("GET %s: expected %d, got %d", path, want, rec.Code)
		}
	}
}
