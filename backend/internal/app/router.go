package app

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/modules/attendance"
	"pos-system/backend/internal/modules/auth"
	"pos-system/backend/internal/modules/catalog"
	"pos-system/backend/internal/modules/licensing"
	"pos-system/backend/internal/modules/pos"
	"pos-system/backend/internal/modules/reporting"
	"pos-system/backend/internal/modules/umkm"
	"pos-system/backend/internal/platform/config"
)

// ModuleRegistrar is implemented by each domain module to register its HTTP routes.
type ModuleRegistrar interface {
	RegisterRoutes(rg *gin.RouterGroup)
}

// NewRouter wires all domain modules and Gin middleware into an http.Handler.
func NewRouter(cfg config.Config, pool *sql.DB) http.Handler {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	modules := []ModuleRegistrar{
		auth.NewModule(auth.NewPGStore(pool), cfg.JWTSecret, cfg.JWTExpiry),
		umkm.NewModule(umkm.NewPGStore(pool), cfg.JWTSecret),
		licensing.NewModule(licensing.NewPGStore(pool), cfg.JWTSecret),
		catalog.NewModule(),
		pos.NewModule(),
		attendance.NewModule(),
		reporting.NewModule(),
	}

	for _, m := range modules {
		m.RegisterRoutes(v1)
	}

	return r
}
