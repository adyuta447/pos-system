package authctx

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestAuthAndRoleMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret"

	r := gin.New()
	r.GET("/admin", RequireAuth(secret), RequireRole("superadmin"), func(c *gin.Context) {
		claims, ok := GetClaims(c)
		if !ok || claims.UserID != "u1" {
			t.Fatalf("unexpected claims: %+v", claims)
		}
		c.Status(http.StatusOK)
	})

	// Missing token -> 401
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/admin", nil))
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}

	// Wrong role -> 403
	ownerTok, err := GenerateToken(secret, Claims{UserID: "u1", UMKMID: "m1", Role: "owner"}, time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	rec = httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	req.Header.Set("Authorization", "Bearer "+ownerTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", rec.Code)
	}

	// Valid role -> 200
	adminTok, err := GenerateToken(secret, Claims{UserID: "u1", Role: "superadmin"}, time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/admin", nil)
	req.Header.Set("Authorization", "Bearer "+adminTok)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}
