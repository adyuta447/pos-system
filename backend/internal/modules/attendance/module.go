package attendance

import (
	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates PIN-based cashier clock-in and clock-out attendance.
type Module struct {
	store     Store
	jwtSecret string
}

// NewModule creates a new attendance module.
func NewModule(store Store, jwtSecret string) *Module {
	return &Module{store: store, jwtSecret: jwtSecret}
}

// RegisterRoutes mounts attendance endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/attendances", authctx.RequireAuth(m.jwtSecret), authctx.RequireRole("owner"), m.handleListAttendances)
}
