package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type memStore struct {
	users map[string]WebUser
}

func (m *memStore) FindByEmail(_ context.Context, email string) (WebUser, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return WebUser{}, ErrNotFound
}

func (m *memStore) FindByID(_ context.Context, id string) (WebUser, error) {
	u, ok := m.users[id]
	if !ok {
		return WebUser{}, ErrNotFound
	}
	return u, nil
}

func (m *memStore) UpdatePasswordHash(_ context.Context, id, passwordHash string) error {
	u, ok := m.users[id]
	if !ok {
		return ErrNotFound
	}
	u.PasswordHash = passwordHash
	m.users[id] = u
	return nil
}

func setupAuthRouter(t *testing.T, active bool) (*gin.Engine, *memStore) {
	t.Helper()
	gin.SetMode(gin.TestMode)
	hash, err := bcrypt.GenerateFromPassword([]byte("secret123"), bcrypt.MinCost)
	if err != nil {
		t.Fatal(err)
	}
	store := &memStore{
		users: map[string]WebUser{
			"u1": {
				ID:           "u1",
				UMKMID:       "m1",
				Name:         "Budi",
				Email:        "budi@warung.id",
				PasswordHash: string(hash),
				Role:         "owner",
				IsActive:     active,
				UMKMActive:   true,
				BranchActive: true,
			},
		},
	}
	r := gin.New()
	NewModule(store, "test-secret", time.Hour).RegisterRoutes(r.Group("/api/v1"))
	return r, store
}

func TestLoginAndMe(t *testing.T) {
	r, _ := setupAuthRouter(t, true)

	// Wrong password -> 401
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/v1/auth/login",
		bytes.NewBufferString(`{"email":"budi@warung.id","password":"wrong"}`)))
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}

	// Valid login -> 200 + token
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/v1/auth/login",
		bytes.NewBufferString(`{"email":"budi@warung.id","password":"secret123"}`)))
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}

	var resp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil || resp.AccessToken == "" {
		t.Fatalf("missing access_token: %v", err)
	}

	// GET /me -> 200
	rec = httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+resp.AccessToken)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on /me, got %d", rec.Code)
	}

	// POST /change-password -> 200
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/change-password",
		bytes.NewBufferString(`{"old_password":"secret123","new_password":"newpass123"}`))
	req.Header.Set("Authorization", "Bearer "+resp.AccessToken)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on /change-password, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestLoginInactiveUser(t *testing.T) {
	r, _ := setupAuthRouter(t, false)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/v1/auth/login",
		bytes.NewBufferString(`{"email":"budi@warung.id","password":"secret123"}`)))
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", rec.Code)
	}
}
