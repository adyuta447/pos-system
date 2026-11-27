package attendance

import "github.com/gin-gonic/gin"

// Module encapsulates PIN-based cashier clock-in and clock-out attendance.
type Module struct{}

// NewModule creates a new attendance module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts attendance endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /attendance/* routes
}
