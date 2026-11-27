package catalog

import "net/http"

// Module encapsulates product catalog and branch stock management.
type Module struct{}

// NewModule creates a new catalog module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts catalog and stock endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/products/* routes
}
