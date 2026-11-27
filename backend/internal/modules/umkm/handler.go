package umkm

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"pos-system/backend/internal/platform/authctx"
)

func hashPIN(pin string) string {
	// Deterministic SHA-256 per branch_id allows UNIQUE(branch_id, pin_hash) in DB.
	sum := sha256.Sum256([]byte(pin))
	return hex.EncodeToString(sum[:])
}

func writeStoreErr(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
	case errors.Is(err, ErrConflict):
		c.JSON(http.StatusConflict, gin.H{"error": "resource already exists"})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}

// --- Superadmin Handlers ---

type createUMKMRequest struct {
	Name          string `json:"name" binding:"required"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	OwnerName     string `json:"owner_name" binding:"required"`
	OwnerEmail    string `json:"owner_email" binding:"required,email"`
	OwnerPassword string `json:"owner_password" binding:"required,min=6"`
}

func (m *Module) handleCreateUMKM(c *gin.Context) {
	var req createUMKMRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.OwnerPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}
	u, ownerID, err := m.store.CreateUMKMWithOwner(c.Request.Context(), CreateUMKMInput{
		Name:              strings.TrimSpace(req.Name),
		Phone:             strings.TrimSpace(req.Phone),
		Address:           strings.TrimSpace(req.Address),
		OwnerName:         strings.TrimSpace(req.OwnerName),
		OwnerEmail:        strings.TrimSpace(req.OwnerEmail),
		OwnerPasswordHash: string(hash),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"umkm": u, "owner_id": ownerID})
}

func (m *Module) handleListUMKMs(c *gin.Context) {
	list, err := m.store.ListUMKMs(c.Request.Context())
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"umkms": list})
}

func (m *Module) handleSetUMKMStatus(c *gin.Context) {
	var req struct {
		IsActive *bool `json:"is_active" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "is_active is required"})
		return
	}
	if err := m.store.SetUMKMStatus(c.Request.Context(), c.Param("id"), *req.IsActive); err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "umkm status updated"})
}

// --- Owner & Branch Admin Handlers ---

func (m *Module) handleCreateBranch(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Name    string `json:"name" binding:"required"`
		Address string `json:"address"`
		Phone   string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	b, err := m.store.CreateBranch(c.Request.Context(), claims.UMKMID, strings.TrimSpace(req.Name), strings.TrimSpace(req.Address), strings.TrimSpace(req.Phone))
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"branch": b})
}

func (m *Module) handleListBranches(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListBranches(c.Request.Context(), claims.UMKMID)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"branches": list})
}

func (m *Module) handleUpdateBranch(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Name     string `json:"name"`
		Address  string `json:"address"`
		Phone    string `json:"phone"`
		IsActive *bool  `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	b, err := m.store.UpdateBranch(c.Request.Context(), claims.UMKMID, c.Param("id"), strings.TrimSpace(req.Name), strings.TrimSpace(req.Address), strings.TrimSpace(req.Phone), req.IsActive)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"branch": b})
}

func canAccessBranch(claims authctx.Claims, branchID string) bool {
	if claims.Role == "owner" {
		return claims.UMKMID != ""
	}
	return claims.Role == "branch_admin" && claims.BranchID == branchID
}

func (m *Module) handleGetBranchSettings(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	branchID := c.Param("id")
	if !canAccessBranch(claims, branchID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	st, err := m.store.GetBranchSettings(c.Request.Context(), claims.UMKMID, branchID)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"settings": st})
}

func (m *Module) handleUpdateBranchSettings(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	branchID := c.Param("id")
	if !canAccessBranch(claims, branchID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	var st BranchSettings
	if err := c.ShouldBindJSON(&st); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	st.BranchID = branchID
	if st.ReceiptPrefix == "" {
		st.ReceiptPrefix = "INV"
	}
	if st.TaxName == "" {
		st.TaxName = "PPN"
	}
	updated, err := m.store.UpsertBranchSettings(c.Request.Context(), claims.UMKMID, st)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"settings": updated})
}

func (m *Module) handleCreateBranchWebUser(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}
	id, err := m.store.CreateBranchWebUser(c.Request.Context(), CreateBranchWebUserInput{
		UMKMID:       claims.UMKMID,
		BranchID:     c.Param("id"),
		Name:         strings.TrimSpace(req.Name),
		Email:        strings.TrimSpace(req.Email),
		PasswordHash: string(hash),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id, "role": "branch_admin"})
}

func (m *Module) handleCreateStaff(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Name string `json:"name" binding:"required"`
		Role string `json:"role" binding:"required,oneof=branch_admin cashier"`
		PIN  string `json:"pin" binding:"required,min=4,max=8"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	st, err := m.store.CreateStaff(c.Request.Context(), CreateStaffInput{
		UMKMID:   claims.UMKMID,
		BranchID: c.Param("id"),
		Name:     strings.TrimSpace(req.Name),
		Role:     req.Role,
		PINHash:  hashPIN(req.PIN),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"staff": st})
}

func (m *Module) handleListStaff(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListStaff(c.Request.Context(), claims.UMKMID, c.Param("id"))
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"staff": list})
}

func (m *Module) handleResetStaffPIN(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		PIN string `json:"pin" binding:"required,min=4,max=8"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := m.store.UpdateStaffPIN(c.Request.Context(), claims.UMKMID, c.Param("id"), c.Param("staffId"), hashPIN(req.PIN)); err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "pin updated"})
}
