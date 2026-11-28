package apiresp

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestBindJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/test", func(c *gin.Context) {
		var req struct {
			OwnerEmail string `json:"owner_email" binding:"required,email"`
		}
		if !BindJSON(c, &req) {
			return
		}
		OK(c, "ok", req)
	})

	// Malformed JSON -> 400
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/test", bytes.NewBufferString(`{bad`)))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}

	// Validation error -> 422 with data.errors.owner_email
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/test", bytes.NewBufferString(`{"owner_email":"not-email"}`)))
	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d: %s", rec.Code, rec.Body.String())
	}
	var resp struct {
		Status int `json:"status"`
		Data   struct {
			Errors map[string][]string `json:"errors"`
		} `json:"data"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatal(err)
	}
	if resp.Status != 422 || len(resp.Data.Errors["owner_email"]) == 0 {
		t.Fatalf("unexpected 422 body: %s", rec.Body.String())
	}
}
