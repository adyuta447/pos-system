package pos

import (
	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

// Module encapsulates cashier transactions, atomic checkout, cash/QRIS, and receipts.
type Module struct {
	store     Store
	jwtSecret string
}

// NewModule creates a new pos module.
func NewModule(store Store, jwtSecret string) *Module {
	return &Module{store: store, jwtSecret: jwtSecret}
}

// RegisterRoutes mounts pos endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	tx := rg.Group("/transactions", authctx.RequireAuth(m.jwtSecret), authctx.RequireRole("owner"))
	tx.GET("", m.handleListTransactions)
	tx.GET("/:id", m.handleGetTransaction)
}
