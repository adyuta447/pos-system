package pos

import "github.com/gin-gonic/gin"

// Module encapsulates cashier transactions, atomic checkout, cash/QRIS, and receipts.
type Module struct{}

// NewModule creates a new pos module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts POS transaction endpoints onto the given router group.
func (m *Module) RegisterRoutes(rg *gin.RouterGroup) {
	// TODO: mount /transactions/* routes
}
