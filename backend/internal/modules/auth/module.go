package auth

import "net/http"

// Module encapsulates authentication, roles, JWT, and PIN session logic.
type Module struct{}

// NewModule creates a new auth module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts auth endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/auth/* routes
}
