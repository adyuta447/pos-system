package attendance

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
	got ListFilter
}

func (m *memStore) ListAttendances(_ context.Context, f ListFilter) ([]Attendance, error) {
	m.got = f
	return []Attendance{}, nil
}

func TestListAttendances(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret"
	store := &memStore{}
	r := gin.New()
	NewModule(store, secret).RegisterRoutes(r.Group("/api/v1"))
	owner, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"}, time.Hour)
	branchAdmin, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "ba-1", UMKMID: "umkm-1", BranchID: "b-1", Role: "branch_admin"}, time.Hour)

	for _, tc := range []struct {
		token, query string
		want         int
	}{
		{owner, "from=2026-11-01&to=2026-11-30&staff_id=s-1", http.StatusOK},
		{owner, "from=2026-11-01", http.StatusBadRequest},
		{owner, "from=2026-11-30&to=2026-11-01", http.StatusBadRequest},
		{branchAdmin, "from=2026-11-01&to=2026-11-30", http.StatusForbidden},
	} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/api/v1/attendances?"+tc.query, nil)
		req.Header.Set("Authorization", "Bearer "+tc.token)
		r.ServeHTTP(rec, req)
		if rec.Code != tc.want {
			t.Fatalf("%s: expected %d, got %d", tc.query, tc.want, rec.Code)
		}
	}
	if store.got.UMKMID != "umkm-1" || store.got.StaffID != "s-1" {
		t.Fatalf("unexpected filter %+v", store.got)
	}
}
