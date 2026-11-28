package auth

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"pos-system/backend/internal/platform/apiresp"
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
	if !apiresp.BindJSON(c, &req) {
		return
	}

	u, err := m.store.FindByEmail(c.Request.Context(), strings.TrimSpace(req.Email))
	if errors.Is(err, ErrNotFound) {
		apiresp.Err(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		apiresp.Err(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}
	if !u.IsActive || !u.UMKMActive || !u.BranchActive {
		apiresp.Err(c, http.StatusForbidden, "Account, UMKM, or branch is inactive")
		return
	}

	token, err := m.issueToken(u)
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	apiresp.OK(c, "Login successful", gin.H{
		"access_token": token,
		"token_type":   "Bearer",
		"user":         userDTO(u),
	})
}

func (m *Module) handleRefresh(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
		return
	}
	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
		return
	}
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	if !u.IsActive || !u.UMKMActive || !u.BranchActive {
		apiresp.Err(c, http.StatusForbidden, "Account, UMKM, or branch is inactive")
		return
	}

	token, err := m.issueToken(u)
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	apiresp.OK(c, "Token refreshed", gin.H{
		"access_token": token,
		"token_type":   "Bearer",
	})
}

func (m *Module) handleChangePassword(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
		return
	}

	var req changePasswordRequest
	if !apiresp.BindJSON(c, &req) {
		return
	}

	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		apiresp.Err(c, http.StatusNotFound, "User not found")
		return
	}
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.OldPassword)); err != nil {
		apiresp.Err(c, http.StatusUnauthorized, "Old password is incorrect")
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	if err := m.store.UpdatePasswordHash(c.Request.Context(), u.ID, string(hashed)); err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	apiresp.OK(c, "Password updated", nil)
}

func (m *Module) handleMe(c *gin.Context) {
	claims, ok := authctx.GetClaims(c)
	if !ok {
		apiresp.Err(c, http.StatusUnauthorized, "Unauthenticated")
		return
	}
	u, err := m.store.FindByID(c.Request.Context(), claims.UserID)
	if errors.Is(err, ErrNotFound) {
		apiresp.Err(c, http.StatusNotFound, "User not found")
		return
	}
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	apiresp.OK(c, "Profile retrieved", userDTO(u))
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
