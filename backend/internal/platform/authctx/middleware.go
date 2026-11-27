package authctx

import (
	"net/http"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
)

const claimsKey = "auth_claims"

// RequireAuth validates the Bearer JWT and stores Claims in the Gin context.
func RequireAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if !strings.HasPrefix(h, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		claims, err := ParseToken(secret, strings.TrimPrefix(h, "Bearer "))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
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
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
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
