package attendance

import "net/http"

// Module encapsulates PIN-based cashier clock-in and clock-out attendance.
type Module struct{}

// NewModule creates a new attendance module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts attendance endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/attendance/* routes
}
