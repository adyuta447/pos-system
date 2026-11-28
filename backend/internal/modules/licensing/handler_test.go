package licensing

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

type memStore struct {
	branchUMKM    map[string]string // branch_id -> umkm_id
	subs          map[string]Subscription
	licenses      map[string]License
	notifications map[string]Notification
	notifUMKM     map[string]string
	seq           int
}

func newMemStore() *memStore {
	return &memStore{
		branchUMKM:    map[string]string{"branch-1": "umkm-1", "branch-2": "umkm-2"},
		subs:          map[string]Subscription{},
		licenses:      map[string]License{},
		notifications: map[string]Notification{},
		notifUMKM:     map[string]string{},
	}
}

func (m *memStore) nextID(prefix string) string {
	m.seq++
	return fmt.Sprintf("%s-%d", prefix, m.seq)
}

func (m *memStore) CreateSubscription(_ context.Context, in CreateSubscriptionInput) (Subscription, error) {
	if m.branchUMKM[in.BranchID] != in.UMKMID {
		return Subscription{}, ErrNotFound
	}
	sub := Subscription{ID: m.nextID("sub"), UMKMID: in.UMKMID, BranchID: in.BranchID, Amount: 30000, PaymentMethod: in.PaymentMethod, Status: "pending"}
	m.subs[sub.ID] = sub
	return sub, nil
}

func (m *memStore) ListSubscriptions(_ context.Context, f Filter) ([]Subscription, error) {
	out := []Subscription{}
	for _, s := range m.subs {
		if (f.UMKMID == "" || s.UMKMID == f.UMKMID) && (f.BranchID == "" || s.BranchID == f.BranchID) && (f.Status == "" || s.Status == f.Status) {
			out = append(out, s)
		}
	}
	return out, nil
}

func (m *memStore) ConfirmSubscription(_ context.Context, id, _, _, licenseKey string, durationDays int) (License, error) {
	s, ok := m.subs[id]
	if !ok {
		return License{}, ErrNotFound
	}
	if s.Status != "pending" {
		return License{}, ErrInvalidState
	}
	s.Status = "confirmed"
	m.subs[id] = s
	l := License{ID: m.nextID("lic"), UMKMID: s.UMKMID, BranchID: s.BranchID, SubscriptionID: id, LicenseKey: licenseKey, Status: "unused", DurationDays: durationDays}
	m.licenses[l.ID] = l
	return l, nil
}

func (m *memStore) RejectSubscription(_ context.Context, id, _, notes string) error {
	s, ok := m.subs[id]
	if !ok {
		return ErrNotFound
	}
	if s.Status != "pending" {
		return ErrInvalidState
	}
	s.Status, s.Notes = "rejected", notes
	m.subs[id] = s
	return nil
}

func (m *memStore) ListLicenses(_ context.Context, f Filter) ([]License, error) {
	out := []License{}
	for _, l := range m.licenses {
		if (f.UMKMID == "" || l.UMKMID == f.UMKMID) && (f.BranchID == "" || l.BranchID == f.BranchID) {
			out = append(out, l)
		}
	}
	return out, nil
}

func (m *memStore) RevokeLicense(_ context.Context, id string) error {
	l, ok := m.licenses[id]
	if !ok {
		return ErrNotFound
	}
	if l.Status != "unused" && l.Status != "active" {
		return ErrInvalidState
	}
	l.Status = "revoked"
	m.licenses[id] = l
	return nil
}

func (m *memStore) ActivateLicense(_ context.Context, umkmID, branchID, key string) (License, error) {
	if m.branchUMKM[branchID] != umkmID {
		return License{}, ErrNotFound
	}
	for id, l := range m.licenses {
		if l.LicenseKey != key || l.BranchID != branchID {
			continue
		}
		if l.Status != "unused" {
			return License{}, ErrInvalidState
		}
		now := time.Now()
		exp := now.AddDate(0, 0, l.DurationDays)
		l.Status, l.ActivatedAt, l.ExpiresAt = "active", &now, &exp
		m.licenses[id] = l
		return l, nil
	}
	return License{}, ErrNotFound
}

func (m *memStore) ListNotifications(_ context.Context, umkmID string) ([]Notification, error) {
	out := []Notification{}
	for id, n := range m.notifications {
		if m.notifUMKM[id] == umkmID {
			out = append(out, n)
		}
	}
	return out, nil
}

func (m *memStore) MarkNotificationRead(_ context.Context, umkmID, id string) error {
	n, ok := m.notifications[id]
	if !ok || m.notifUMKM[id] != umkmID {
		return ErrNotFound
	}
	now := time.Now()
	n.ReadAt = &now
	m.notifications[id] = n
	return nil
}

func setup(t *testing.T) (*gin.Engine, *memStore, string) {
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

func do(t *testing.T, r *gin.Engine, token, method, path, body string) *httptest.ResponseRecorder {
	t.Helper()
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, bytes.NewBufferString(body))
	req.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(rec, req)
	return rec
}

func TestSubscriptionToActivationFlow(t *testing.T) {
	r, _, secret := setup(t)
	owner := tok(t, secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"})
	admin := tok(t, secret, authctx.Claims{UserID: "sa-1", Role: "superadmin"})

	// Owner reports payment for own branch -> 201; foreign branch -> 404; missing method -> 400
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-1/subscriptions", `{"payment_method":"transfer BCA"}`); rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-2/subscriptions", `{"payment_method":"transfer"}`); rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for foreign branch, got %d", rec.Code)
	}
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-1/subscriptions", `{}`); rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 without payment_method, got %d", rec.Code)
	}

	// Owner cannot confirm -> 403; superadmin confirms with empty body -> 200 + key; confirm again -> 409
	if rec := do(t, r, owner, http.MethodPatch, "/api/v1/admin/subscriptions/sub-1/confirm", ""); rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", rec.Code)
	}
	rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/subscriptions/sub-1/confirm", "")
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}
	var confirmed struct{ License License }
	_ = json.Unmarshal(rec.Body.Bytes(), &confirmed)
	if confirmed.License.DurationDays != defaultDurationDays || confirmed.License.Status != "unused" {
		t.Fatalf("unexpected license: %+v", confirmed.License)
	}
	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/subscriptions/sub-1/confirm", ""); rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 on double confirm, got %d", rec.Code)
	}
	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/subscriptions/sub-1/reject", `{"notes":"late"}`); rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 rejecting a confirmed payment, got %d", rec.Code)
	}

	// Owner activates: wrong key -> 404; lowercase key accepted -> 200; reuse -> 409
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-1/licenses/activate", `{"license_key":"AAAA-BBBB-CCCC-DDDD"}`); rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for unknown key, got %d", rec.Code)
	}
	body := fmt.Sprintf(`{"license_key":" %s "}`, bytes.ToLower([]byte(confirmed.License.LicenseKey)))
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-1/licenses/activate", body); rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on activation, got %d: %s", rec.Code, rec.Body.String())
	}
	if rec := do(t, r, owner, http.MethodPost, "/api/v1/branches/branch-1/licenses/activate", body); rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 on reused key, got %d", rec.Code)
	}

	// Branch licenses report the active period
	rec = do(t, r, owner, http.MethodGet, "/api/v1/branches/branch-1/licenses", "")
	var listed struct {
		ActiveUntil *time.Time `json:"active_until"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &listed)
	if rec.Code != http.StatusOK || listed.ActiveUntil == nil {
		t.Fatalf("expected active_until after activation, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestRejectAndRevoke(t *testing.T) {
	r, store, secret := setup(t)
	admin := tok(t, secret, authctx.Claims{UserID: "sa-1", Role: "superadmin"})
	store.subs["sub-9"] = Subscription{ID: "sub-9", UMKMID: "umkm-1", BranchID: "branch-1", Status: "pending"}
	store.licenses["lic-9"] = License{ID: "lic-9", UMKMID: "umkm-1", BranchID: "branch-1", Status: "unused"}

	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/subscriptions/sub-9/reject", `{}`); rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 without reason, got %d", rec.Code)
	}
	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/subscriptions/sub-9/reject", `{"notes":"bukti tidak valid"}`); rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec := do(t, r, admin, http.MethodGet, "/api/v1/admin/subscriptions?status=paid", ""); rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for unknown status, got %d", rec.Code)
	}
	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/licenses/lic-9/revoke", ""); rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec := do(t, r, admin, http.MethodPatch, "/api/v1/admin/licenses/lic-9/revoke", ""); rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 revoking twice, got %d", rec.Code)
	}
}

func TestNotificationsAreTenantScoped(t *testing.T) {
	r, store, secret := setup(t)
	store.notifications["n-1"] = Notification{ID: "n-1", Title: "Langganan segera berakhir"}
	store.notifUMKM["n-1"] = "umkm-1"
	owner2 := tok(t, secret, authctx.Claims{UserID: "o-2", UMKMID: "umkm-2", Role: "owner"})

	if rec := do(t, r, owner2, http.MethodPatch, "/api/v1/notifications/n-1/read", ""); rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for another tenant's notification, got %d", rec.Code)
	}
}

func TestGenerateLicenseKeyFormat(t *testing.T) {
	re := regexp.MustCompile(`^[A-Z2-7]{4}-[A-Z2-7]{4}-[A-Z2-7]{4}-[A-Z2-7]{4}$`)
	seen := map[string]bool{}
	for range 100 {
		k, err := generateLicenseKey()
		if err != nil || !re.MatchString(k) || seen[k] {
			t.Fatalf("bad or duplicate key %q (err %v)", k, err)
		}
		seen[k] = true
	}
}

func TestActiveUntilIgnoresExpiredAndRevoked(t *testing.T) {
	now := time.Now()
	past, soon, later := now.Add(-time.Hour), now.Add(24*time.Hour), now.Add(48*time.Hour)
	got := activeUntil([]License{
		{Status: "active", ExpiresAt: &soon},
		{Status: "revoked", ExpiresAt: &later},
		{Status: "active", ExpiresAt: &past},
	}, now)
	if got == nil || !got.Equal(soon) {
		t.Fatalf("expected %v, got %v", soon, got)
	}
}
