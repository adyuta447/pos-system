package reporting

import "net/http"

// Module encapsulates branch financial reports and owner multi-branch dashboards.
type Module struct{}

// NewModule creates a new reporting module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts reporting endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/reports/* routes
}
