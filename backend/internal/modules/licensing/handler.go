package licensing

import (
	"crypto/rand"
	"encoding/base32"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/apiresp"
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
		apiresp.Err(c, http.StatusNotFound, "Resource not found")
	case errors.Is(err, ErrInvalidState):
		apiresp.Err(c, http.StatusConflict, "Resource is not in a valid state for this action")
	default:
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
	}
}

// --- Superadmin Handlers ---

func (m *Module) handleAdminListSubscriptions(c *gin.Context) {
	status := c.Query("status")
	if status != "" && status != "pending" && status != "confirmed" && status != "rejected" {
		apiresp.Err(c, http.StatusBadRequest, "status must be pending, confirmed, or rejected")
		return
	}
	list, err := m.store.ListSubscriptions(c.Request.Context(), Filter{
		UMKMID: c.Query("umkm_id"), BranchID: c.Query("branch_id"), Status: status,
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Subscriptions retrieved", list)
}

func (m *Module) handleConfirmSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		DurationDays int    `json:"duration_days" binding:"omitempty,min=1,max=366"`
		Notes        string `json:"notes"`
	}
	if !apiresp.BindOptionalJSON(c, &req) {
		return
	}
	if req.DurationDays == 0 {
		req.DurationDays = defaultDurationDays
	}
	key, err := generateLicenseKey()
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	l, err := m.store.ConfirmSubscription(c.Request.Context(), c.Param("id"), claims.UserID, strings.TrimSpace(req.Notes), key, req.DurationDays)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Subscription confirmed", l)
}

func (m *Module) handleRejectSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		Notes string `json:"notes" binding:"required"`
	}
	if !apiresp.BindJSON(c, &req) {
		return
	}
	if err := m.store.RejectSubscription(c.Request.Context(), c.Param("id"), claims.UserID, strings.TrimSpace(req.Notes)); err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Subscription rejected", nil)
}

func (m *Module) handleAdminListLicenses(c *gin.Context) {
	list, err := m.store.ListLicenses(c.Request.Context(), Filter{
		UMKMID: c.Query("umkm_id"), BranchID: c.Query("branch_id"), Status: c.Query("status"),
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Licenses retrieved", list)
}

func (m *Module) handleRevokeLicense(c *gin.Context) {
	if err := m.store.RevokeLicense(c.Request.Context(), c.Param("id")); err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "License revoked", nil)
}

// --- Owner Handlers ---

func (m *Module) handleCreateSubscription(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	var req struct {
		PaymentMethod   string `json:"payment_method" binding:"required"`
		PaymentProofURL string `json:"payment_proof_url" binding:"omitempty,url"`
		Notes           string `json:"notes"`
	}
	if !apiresp.BindJSON(c, &req) {
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
	apiresp.Created(c, "Subscription submitted", sub)
}

func (m *Module) handleListBranchSubscriptions(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListSubscriptions(c.Request.Context(), Filter{UMKMID: claims.UMKMID, BranchID: c.Param("id")})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Subscriptions retrieved", list)
}

func (m *Module) handleListBranchLicenses(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListLicenses(c.Request.Context(), Filter{UMKMID: claims.UMKMID, BranchID: c.Param("id")})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Licenses retrieved", gin.H{"licenses": list, "active_until": activeUntil(list, time.Now())})
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
	if !apiresp.BindJSON(c, &req) {
		return
	}
	l, err := m.store.ActivateLicense(c.Request.Context(), claims.UMKMID, c.Param("id"), strings.ToUpper(strings.TrimSpace(req.LicenseKey)))
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "License activated", l)
}

func (m *Module) handleListNotifications(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	list, err := m.store.ListNotifications(c.Request.Context(), claims.UMKMID)
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Notifications retrieved", list)
}

func (m *Module) handleMarkNotificationRead(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	if err := m.store.MarkNotificationRead(c.Request.Context(), claims.UMKMID, c.Param("id")); err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Notification marked as read", nil)
}
