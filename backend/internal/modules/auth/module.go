package auth

import "github.com/gin-gonic/gin"

// Module encapsulates authentication, roles, JWT, and PIN session logic.
type Module struct{}

// NewModule creates a new auth module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts auth endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /auth/* routes
}
