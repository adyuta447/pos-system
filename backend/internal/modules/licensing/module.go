package licensing

import "net/http"

// Module encapsulates branch license keys, subscriptions, and expiry notifications.
type Module struct{}

// NewModule creates a new licensing module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts licensing endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/licenses/* routes
}
