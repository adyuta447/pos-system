package app

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"pos-system/backend/internal/modules/attendance"
	"pos-system/backend/internal/modules/auth"
	"pos-system/backend/internal/modules/catalog"
	"pos-system/backend/internal/modules/licensing"
	"pos-system/backend/internal/modules/pos"
	"pos-system/backend/internal/modules/reporting"
	"pos-system/backend/internal/modules/umkm"
	"pos-system/backend/internal/platform/apiresp"
	"pos-system/backend/internal/platform/config"
)

// ModuleRegistrar is implemented by each domain module to register its HTTP routes.
type ModuleRegistrar interface {
	RegisterRoutes(rg *gin.RouterGroup)
}

// NewRouter wires all domain modules and Gin middleware into an http.Handler.
func NewRouter(cfg config.Config, pool *sql.DB) http.Handler {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), requireUUIDs)

	r.GET("/health", func(c *gin.Context) {
		apiresp.OK(c, "Service healthy", gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	modules := []ModuleRegistrar{
		auth.NewModule(auth.NewPGStore(pool), cfg.JWTSecret, cfg.JWTExpiry),
		umkm.NewModule(umkm.NewPGStore(pool), cfg.JWTSecret),
		licensing.NewModule(licensing.NewPGStore(pool), cfg.JWTSecret),
		catalog.NewModule(),
		pos.NewModule(pos.NewPGStore(pool), cfg.JWTSecret),
		attendance.NewModule(attendance.NewPGStore(pool), cfg.JWTSecret),
		reporting.NewModule(reporting.NewPGStore(pool), cfg.JWTSecret),
	}

	for _, m := range modules {
		m.RegisterRoutes(v1)
	}

	return r
}

// requireUUIDs answers 404 for any ID that is not a UUID (path :id/:staffId, query *_id),
// since no such resource can exist and Postgres would otherwise fail the query with a 500.
func requireUUIDs(c *gin.Context) {
	isID := func(key string) bool {
		return key == "id" || strings.HasSuffix(key, "Id") || strings.HasSuffix(key, "_id")
	}
	for _, p := range c.Params {
		if isID(p.Key) && uuid.Validate(p.Value) != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
	}
	for key, vals := range c.Request.URL.Query() {
		for _, v := range vals {
			if isID(key) && v != "" && uuid.Validate(v) != nil {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "resource not found"})
				return
			}
		}
	}
	c.Next()
}
