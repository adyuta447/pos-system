package auth

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"pos-system/backend/internal/platform/authctx"
)

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type changePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

func (m *Module) handleLogin(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email or password format"})
		return
	}

	u, err := m.store.FindByEmail(c.Request.Context(), strings.TrimSpace(req.Email))
	if errors.Is(err, ErrNotFound) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query user"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if !u.IsActive || !u.UMKMActive || !u.BranchActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "account, umkm, or branch is inactive"})
		return
	}

	token, err := m.issueToken(u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
		"token_type":   "Bearer",
		"user":         userDTO(u),
	})
}

func (m *Module) handleRefresh(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query user"})
		return
	}
	if !u.IsActive || !u.UMKMActive || !u.BranchActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "account, umkm, or branch is inactive"})
		return
	}

	token, err := m.issueToken(u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
		"token_type":   "Bearer",
	})
}

func (m *Module) handleChangePassword(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req changePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "old_password and new_password (min 6 chars) are required"})
		return
	}

	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query user"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "old password is incorrect"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	if err := m.store.UpdatePasswordHash(c.Request.Context(), u.ID, string(hashed)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password updated"})
}

func (m *Module) handleMe(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": userDTO(u)})
}

func (m *Module) issueToken(u WebUser) (string, error) {
	return authctx.GenerateToken(m.jwtSecret, authctx.Claims{
		UserID:   u.ID,
		UMKMID:   u.UMKMID,
		BranchID: u.BranchID,
		Role:     u.Role,
	}, m.jwtExpiry)
}

func userDTO(u WebUser) gin.H {
	return gin.H{
		"id":        u.ID,
		"umkm_id":   nullableStr(u.UMKMID),
		"branch_id": nullableStr(u.BranchID),
		"name":      u.Name,
		"email":     u.Email,
		"role":      u.Role,
		"is_active": u.IsActive,
	}
}

func nullableStr(s string) any {
	if s == "" {
		return nil
	}
	return s
}
