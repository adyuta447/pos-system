package app

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/config"
)

func TestHealth(t *testing.T) {
	gin.SetMode(gin.TestMode)
	rec := httptest.NewRecorder()
	NewRouter(config.Load(), nil).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/health", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if strings.TrimSpace(rec.Body.String()) != `{"status":"ok"}` {
		t.Fatalf("unexpected body: %q", rec.Body.String())
	}
}

func TestNonUUIDIDsAreNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := NewRouter(config.Load(), nil)
	valid := "01900000-0000-7000-8000-000000000020"
	for path, want := range map[string]int{
		// Rejected before auth or the database runs.
		"/api/v1/transactions/not-a-uuid":                                   http.StatusNotFound,
		"/api/v1/branches/" + valid + "/staff/abc":                          http.StatusNotFound,
		"/api/v1/transactions?branch_id=abc":                                http.StatusNotFound,
		"/api/v1/reports/summary?from=2026-11-01&to=2026-11-30&branch_id=x": http.StatusNotFound,
		// Valid or empty IDs pass through to the route (401: no token).
		"/api/v1/transactions/" + valid:   http.StatusUnauthorized,
		"/api/v1/transactions?branch_id=": http.StatusUnauthorized,
		"/api/v1/transactions?page=abc":   http.StatusUnauthorized,
	} {
		rec := httptest.NewRecorder()
		r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
		if rec.Code != want {
			t.Fatalf("GET %s: expected %d, got %d", path, want, rec.Code)
		}
	}
}
