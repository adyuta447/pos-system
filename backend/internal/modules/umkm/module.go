package umkm

import (
	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates UMKM, branch management, store setup, and staff management.
type Module struct {
	store     Store
	jwtSecret string
}

// NewModule creates a new umkm module.
func NewModule(store Store, jwtSecret string) *Module {
	return &Module{store: store, jwtSecret: jwtSecret}
}

// RegisterRoutes mounts umkm and branch endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	authMW := authctx.RequireAuth(m.jwtSecret)

	// Superadmin routes
	admin := rg.Group("/admin/umkms", authMW, authctx.RequireRole("superadmin"))
	admin.POST("", m.handleCreateUMKM)
	admin.GET("", m.handleListUMKMs)
	admin.PATCH("/:id/status", m.handleSetUMKMStatus)

	// Owner & Branch Admin routes
	branches := rg.Group("/branches", authMW)
	ownerOnly := branches.Group("", authctx.RequireRole("owner"))
	ownerOnly.POST("", m.handleCreateBranch)
	ownerOnly.GET("", m.handleListBranches)
	ownerOnly.PATCH("/:id", m.handleUpdateBranch)
	ownerOnly.POST("/:id/web-users", m.handleCreateBranchWebUser)
	ownerOnly.POST("/:id/staff", m.handleCreateStaff)
	ownerOnly.GET("/:id/staff", m.handleListStaff)
	ownerOnly.PATCH("/:id/staff/:staffId/pin", m.handleResetStaffPIN)

	settings := branches.Group("", authctx.RequireRole("owner", "branch_admin"))
	settings.GET("/:id/settings", m.handleGetBranchSettings)
	settings.PUT("/:id/settings", m.handleUpdateBranchSettings)
}
