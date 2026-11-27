package pos

import "net/http"

// Module encapsulates cashier transactions, atomic checkout, cash/QRIS, and receipts.
type Module struct{}

// NewModule creates a new pos module.
func NewModule() *Module {
	return &Module{}
}

// RegisterRoutes mounts POS transaction endpoints onto the given router.
func (m *Module) RegisterRoutes(mux *http.ServeMux) {
	// TODO: mount /api/v1/transactions/* routes
}
