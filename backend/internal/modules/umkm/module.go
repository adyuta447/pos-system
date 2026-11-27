package umkm

import "net/http"

// Module encapsulates UMKM, branch management, store setup, and tax settings.
type Module struct{}

// NewModule creates a new umkm module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts umkm and branch endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/umkm/* and /api/v1/branches/* routes
}
