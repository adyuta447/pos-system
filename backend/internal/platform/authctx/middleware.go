package authctx

import (
	"net/http"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/apiresp"
)

const claimsKey = "auth_claims"

// RequireAuth validates the Bearer JWT and stores Claims in the Gin context.
func RequireAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if !strings.HasPrefix(h, "Bearer ") {
			apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
			c.Abort()
			return
		}
		claims, err := ParseToken(secret, strings.TrimPrefix(h, "Bearer "))
		if err != nil {
			apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
			c.Abort()
			return
		}
		c.Set(claimsKey, claims)
		c.Next()
	}
}

// RequireRole ensures the authenticated user has one of the allowed roles.
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := GetClaims(c)
		if !ok || !slices.Contains(roles, claims.Role) {
			apiresp.Err(c, http.StatusForbidden, "You do not have permission to perform this action")
			c.Abort()
			return
		}
		c.Next()
	}
}

// GetClaims retrieves Claims from the Gin context.
func GetClaims(c *gin.Context) (Claims, bool) {
	val, ok := c.Get(claimsKey)
	if !ok {
		return Claims{}, false
	}
	claims, ok := val.(Claims)
	return claims, ok
}
