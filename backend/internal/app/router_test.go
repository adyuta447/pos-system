package app

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
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
	var resp struct {
		Message string            `json:"message"`
		Data    map[string]string `json:"data"`
		Status  int               `json:"status"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Status != 200 || resp.Data["status"] != "ok" {
		t.Fatalf("unexpected envelope: %+v", resp)
	}
}
