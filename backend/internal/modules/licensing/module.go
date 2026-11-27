package licensing

import "github.com/gin-gonic/gin"

// Module encapsulates branch license keys, subscriptions, and expiry notifications.
type Module struct{}

// NewModule creates a new licensing module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts licensing endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /licenses/* routes
}
