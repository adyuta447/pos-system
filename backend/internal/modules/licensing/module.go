package licensing

import (
	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates branch license keys, subscriptions, and expiry notifications.
type Module struct {
	store     Store
	jwtSecret string
}

// NewModule creates a new licensing module.
func NewModule(store Store, jwtSecret string) *Module {
	return &Module{store: store, jwtSecret: jwtSecret}
}

// RegisterRoutes mounts licensing endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	authMW := authctx.RequireAuth(m.jwtSecret)

	// Superadmin routes
	admin := rg.Group("/admin", authMW, authctx.RequireRole("superadmin"))
	admin.GET("/subscriptions", m.handleAdminListSubscriptions)
	admin.PATCH("/subscriptions/:id/confirm", m.handleConfirmSubscription)
	admin.PATCH("/subscriptions/:id/reject", m.handleRejectSubscription)
	admin.GET("/licenses", m.handleAdminListLicenses)
	admin.PATCH("/licenses/:id/revoke", m.handleRevokeLicense)

	// Owner routes
	owner := rg.Group("", authMW, authctx.RequireRole("owner"))
	owner.POST("/branches/:id/subscriptions", m.handleCreateSubscription)
	owner.GET("/branches/:id/subscriptions", m.handleListBranchSubscriptions)
	owner.GET("/branches/:id/licenses", m.handleListBranchLicenses)
	owner.POST("/branches/:id/licenses/activate", m.handleActivateLicense)
	owner.GET("/notifications", m.handleListNotifications)
	owner.PATCH("/notifications/:id/read", m.handleMarkNotificationRead)
}
