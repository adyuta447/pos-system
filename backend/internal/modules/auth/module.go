package auth

import (
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates authentication, roles, and JWT session logic.
type Module struct {
	store     Store
	jwtSecret string
	jwtExpiry time.Duration
}

// NewModule creates a new auth module.
func NewModule(store Store, jwtSecret string, jwtExpiry time.Duration) *Module {
	return &Module{
		store:     store,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

// RegisterRoutes mounts auth endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	g := rg.Group("/auth")
	g.POST("/login", m.handleLogin)

	protected := g.Group("", authctx.RequireAuth(m.jwtSecret))
	protected.POST("/refresh", m.handleRefresh)
	protected.POST("/change-password", m.handleChangePassword)
	protected.GET("/me", m.handleMe)
}
