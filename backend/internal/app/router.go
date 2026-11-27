package app

import (
	"net/http"

	"pos-system/backend/internal/modules/attendance"
	"pos-system/backend/internal/modules/auth"
	"pos-system/backend/internal/modules/catalog"
	"pos-system/backend/internal/modules/licensing"
	"pos-system/backend/internal/modules/pos"
	"pos-system/backend/internal/modules/reporting"
	"pos-system/backend/internal/modules/umkm"
	"pos-system/backend/internal/platform/httpx"
	"pos-system/backend/internal/platform/middleware"
)

// ModuleRegistrar is implemented by each domain module to register its HTTP routes.
type ModuleRegistrar interface {
	RegisterRoutes(mux *http.ServeMux)
}

// NewRouter wires all domain modules and shared middleware into an http.Handler.
func NewRouter() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	modules := []ModuleRegistrar{
		auth.NewModule(),
		umkm.NewModule(),
		licensing.NewModule(),
		catalog.NewModule(),
		pos.NewModule(),
		attendance.NewModule(),
		reporting.NewModule(),
	}

	for _, m := range modules {
		m.RegisterRoutes(mux)
	}

	return middleware.Recover(middleware.Logging(mux))
}
