package umkm

import "github.com/gin-gonic/gin"

// Module encapsulates UMKM, branch management, store setup, and tax settings.
type Module struct{}

// NewModule creates a new umkm module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts umkm and branch endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /umkm/* and /branches/* routes
}
