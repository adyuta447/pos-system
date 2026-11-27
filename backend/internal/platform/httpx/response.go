package httpx

import (
	"encoding/json"
	"net/http"
)

// ErrorBody represents a standard API error payload.
type ErrorBody struct {
	Error string `json:"error"`
}

// JSON writes a JSON-encoded payload with the given HTTP status code.
func JSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

// Error writes a standard JSON error response.
func Error(w http.ResponseWriter, status int, message string) {
	JSON(w, status, ErrorBody{Error: message})
}
