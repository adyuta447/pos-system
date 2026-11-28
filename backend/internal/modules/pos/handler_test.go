package pos

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
	txs map[string]Transaction // id -> transaction
	own map[string]string      // id -> umkm_id
	got ListFilter
}

func (m *memStore) ListTransactions(_ context.Context, f ListFilter) ([]Transaction, int, error) {
	m.got = f
	out := []Transaction{}
	for id, t := range m.txs {
		if m.own[id] == f.UMKMID {
			out = append(out, t)
		}
	}
	return out, len(out), nil
}

func (m *memStore) GetTransaction(_ context.Context, umkmID, id string) (Transaction, error) {
	t, ok := m.txs[id]
	if !ok || m.own[id] != umkmID {
		return Transaction{}, ErrNotFound
	}
	return t, nil
}

func TestTransactionHistory(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret"
	store := &memStore{
		txs: map[string]Transaction{"tx-1": {ID: "tx-1", ReceiptNo: "INV-001", Items: []Item{{ProductName: "Kopi", Qty: 2}}}},
		own: map[string]string{"tx-1": "umkm-1"},
	}
	r := gin.New()
	NewModule(store, secret).RegisterRoutes(r.Group("/api/v1"))
	owner1, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "o-1", UMKMID: "umkm-1", Role: "owner"}, time.Hour)
	owner2, _ := authctx.GenerateToken(secret, authctx.Claims{UserID: "o-2", UMKMID: "umkm-2", Role: "owner"}, time.Hour)

	for _, tc := range []struct {
		token, path string
		want        int
	}{
		{owner1, "/api/v1/transactions?page=2&limit=10", http.StatusOK},
		{owner1, "/api/v1/transactions?limit=500", http.StatusBadRequest},
		{owner1, "/api/v1/transactions?page=0", http.StatusBadRequest},
		{owner1, "/api/v1/transactions?from=2026/11/01", http.StatusBadRequest},
		{owner1, "/api/v1/transactions/tx-1", http.StatusOK},
		{owner2, "/api/v1/transactions/tx-1", http.StatusNotFound},
	} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		req.Header.Set("Authorization", "Bearer "+tc.token)
		r.ServeHTTP(rec, req)
		if rec.Code != tc.want {
			t.Fatalf("GET %s: expected %d, got %d: %s", tc.path, tc.want, rec.Code, rec.Body.String())
		}
	}
	if store.got.Offset != 10 || store.got.Limit != 10 {
		t.Fatalf("page=2&limit=10 should map to offset 10, got %+v", store.got)
	}
}
