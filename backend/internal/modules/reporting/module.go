package reporting

import (
	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates branch financial reports and owner multi-branch dashboards.
type Module struct {
	store     Store
	jwtSecret string
}

// NewModule creates a new reporting module.
func NewModule(store Store, jwtSecret string) *Module {
	return &Module{store: store, jwtSecret: jwtSecret}
}

// RegisterRoutes mounts reporting endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	reports := rg.Group("/reports", authctx.RequireAuth(m.jwtSecret), authctx.RequireRole("owner"))
	reports.GET("/summary", m.handleSummary)
}
