package catalog

import "github.com/gin-gonic/gin"

// Module encapsulates product catalog and branch stock management.
type Module struct{}

// NewModule creates a new catalog module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts catalog and stock endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /products/* routes
}
