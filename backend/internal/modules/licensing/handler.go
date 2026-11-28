package licensing

import (
	"crypto/rand"
	"encoding/base32"
	"errors"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

const defaultDurationDays = 30

// generateLicenseKey returns a random key such as "ABCD-EFGH-IJKL-MNOP" (80 bits).
// shortcut: opaque key verified online only; switch to a provider-signed key (PRD: offline verification on tablet) when the tablet API is built.
func generateLicenseKey() (string, error) {
	b := make([]byte, 10)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	s := base32.StdEncoding.EncodeToString(b)
	return s[0:4] + "-" + s[4:8] + "-" + s[8:12] + "-" + s[12:16], nil
}

func writeStoreErr(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
	case errors.Is(err, ErrInvalidState):
		c.JSON(http.StatusConflict, gin.H{"error": "resource is not in a valid state for this action"})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}

// bindOptionalJSON accepts an empty body for endpoints whose fields are all optional.
func bindOptionalJSON(c *gin.Context, v any) bool {
	if err := c.ShouldBindJSON(v); err != nil && !errors.Is(err, io.EOF) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return false
	}
	return true
}

// --- Superadmin Handlers ---

func (m *Module) handleAdminListSubscriptions(c *gin.Context) {
	status := c.Query("status")
	if status != "" && status != "pending" && status != "confirmed" && status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status must be pending, confirmed, or rejected"})
		return
	}
	list, err := m.store.ListSubscriptions(c.Request.Context(), Filter{
		UMKMID: c.Query("umkm_id"), BranchID: c.Query("branch_id"), Status: status,
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"subscriptions": list})
}

func (m *Module) handleConfirmSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		DurationDays int    `json:"duration_days" binding:"omitempty,min=1,max=366"`
		Notes        string `json:"notes"`
	}
	if !bindOptionalJSON(c, &req) {
		return
	}
	if req.DurationDays == 0 {
		req.DurationDays = defaultDurationDays
	}
	key, err := generateLicenseKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate license key"})
		return
	}
	l, err := m.store.ConfirmSubscription(c.Request.Context(), c.Param("id"), claims.UserID, strings.TrimSpace(req.Notes), key, req.DurationDays)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"license": l})
}

func (m *Module) handleRejectSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Notes string `json:"notes" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "notes (rejection reason) is required"})
		return
	}
	if err := m.store.RejectSubscription(c.Request.Context(), c.Param("id"), claims.UserID, strings.TrimSpace(req.Notes)); err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "subscription rejected"})
}

func (m *Module) handleAdminListLicenses(c *gin.Context) {
	list, err := m.store.ListLicenses(c.Request.Context(), Filter{
		UMKMID: c.Query("umkm_id"), BranchID: c.Query("branch_id"), Status: c.Query("status"),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"licenses": list})
}

func (m *Module) handleRevokeLicense(c *gin.Context) {
	if err := m.store.RevokeLicense(c.Request.Context(), c.Param("id")); err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "license revoked"})
}

// --- Owner Handlers ---

func (m *Module) handleCreateSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		PaymentMethod   string `json:"payment_method" binding:"required"`
		PaymentProofURL string `json:"payment_proof_url" binding:"omitempty,url"`
		Notes           string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sub, err := m.store.CreateSubscription(c.Request.Context(), CreateSubscriptionInput{
		UMKMID:          claims.UMKMID,
		BranchID:        c.Param("id"),
		PaymentMethod:   strings.TrimSpace(req.PaymentMethod),
		PaymentProofURL: strings.TrimSpace(req.PaymentProofURL),
		Notes:           strings.TrimSpace(req.Notes),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"subscription": sub})
}

func (m *Module) handleListBranchSubscriptions(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListSubscriptions(c.Request.Context(), Filter{UMKMID: claims.UMKMID, BranchID: c.Param("id")})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"subscriptions": list})
}

func (m *Module) handleListBranchLicenses(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListLicenses(c.Request.Context(), Filter{UMKMID: claims.UMKMID, BranchID: c.Param("id")})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"licenses": list, "active_until": activeUntil(list, time.Now())})
}

// activeUntil returns the end of the branch's paid period, or nil when it has none left.
func activeUntil(list []License, now time.Time) *time.Time {
	var until *time.Time
	for _, l := range list {
		if l.Status == "active" && l.ExpiresAt != nil && l.ExpiresAt.After(now) && (until == nil || l.ExpiresAt.After(*until)) {
			until = l.ExpiresAt
		}
	}
	return until
}

func (m *Module) handleActivateLicense(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		LicenseKey string `json:"license_key" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "license_key is required"})
		return
	}
	l, err := m.store.ActivateLicense(c.Request.Context(), claims.UMKMID, c.Param("id"), strings.ToUpper(strings.TrimSpace(req.LicenseKey)))
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"license": l})
}

func (m *Module) handleListNotifications(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListNotifications(c.Request.Context(), claims.UMKMID)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"notifications": list})
}

func (m *Module) handleMarkNotificationRead(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	if err := m.store.MarkNotificationRead(c.Request.Context(), claims.UMKMID, c.Param("id")); err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notification marked as read"})
}
