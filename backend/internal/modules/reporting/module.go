package reporting

import "github.com/gin-gonic/gin"

// Module encapsulates branch financial reports and owner multi-branch dashboards.
type Module struct{}

// NewModule creates a new reporting module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts reporting endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /reports/* routes
}
