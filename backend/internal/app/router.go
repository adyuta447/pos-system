package app

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/modules/attendance"
	"pos-system/backend/internal/modules/auth"
	"pos-system/backend/internal/modules/catalog"
	"pos-system/backend/internal/modules/licensing"
	"pos-system/backend/internal/modules/pos"
	"pos-system/backend/internal/modules/reporting"
	"pos-system/backend/internal/modules/umkm"
)

// ModuleRegistrar is implemented by each domain module to register its HTTP routes.
type ModuleRegistrar interface {
	RegisterRoutes(rg *gin.RouterGroup)
}

// NewRouter wires all domain modules and Gin middleware into an http.Handler.
func NewRouter() http.Handler {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
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
		m.RegisterRoutes(v1)
	}

	return r
}
