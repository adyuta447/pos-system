package reporting

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

type memStore struct {
	got SummaryFilter
}

func (m *memStore) Summary(_ context.Context, f SummaryFilter) (Summary, error) {
	m.got = f
	if f.BranchID == "foreign" {
		return Summary{}, ErrNotFound
	}
	return Summary{From: f.From, To: f.To, Period: f.Period}, nil
}

func TestSummaryValidationAndScope(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret"
	store := &memStore{}
	r := gin.New()
	NewModule(store, secret).RegisterRoutes(r.Group("/api/v1"))

	owner, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"}, time.Hour)
	admin, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "sa-1", Role: "superadmin"}, time.Hour)

	for _, tc := range []struct {
		token, query string
		want         int
	}{
		{owner, "from=2026-11-01&to=2026-11-30", http.StatusOK},
		{owner, "from=2026-11-01&to=2026-11-30&period=monthly&branch_id=b-1", http.StatusOK},
		{owner, "to=2026-11-30", http.StatusBadRequest},
		{owner, "from=01-11-2026&to=2026-11-30", http.StatusBadRequest},
		{owner, "from=2026-11-30&to=2026-11-01", http.StatusBadRequest},
		{owner, "from=2026-11-01&to=2026-11-30&period=weekly", http.StatusBadRequest},
		{owner, "from=2026-11-01&to=2026-11-30&branch_id=foreign", http.StatusNotFound},
		{admin, "from=2026-11-01&to=2026-11-30", http.StatusForbidden},
	} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/api/v1/reports/summary?"+tc.query, nil)
		req.Header.Set("Authorization", "Bearer "+tc.token)
		r.ServeHTTP(rec, req)
		if rec.Code != tc.want {
			t.Fatalf("%s: expected %d, got %d: %s", tc.query, tc.want, rec.Code, rec.Body.String())
		}
	}
	if store.got.UMKMID != "umkm-1" {
		t.Fatalf("summary must be scoped to the caller's umkm, got %q", store.got.UMKMID)
	}
}
