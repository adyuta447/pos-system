package pos

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/apiresp"
	"pos-system/backend/internal/platform/authctx"
)

const (
	dateLayout   = "2006-01-02"
	defaultLimit = 50
	maxLimit     = 200
)

func writeStoreErr(c *gin.Context, err error) {
	if errors.Is(err, ErrNotFound) {
		apiresp.Err(c, http.StatusNotFound, "Resource not found")
		return
	}
	apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
}

// handleListTransactions serves the owner's cross-branch history (synced transactions only).
func (m *Module) handleListTransactions(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	for _, key := range []string{"from", "to"} {
		if v := c.Query(key); v != "" {
			if _, err := time.Parse(dateLayout, v); err != nil {
				apiresp.Err(c, http.StatusBadRequest, key+" must be in YYYY-MM-DD format")
				return
			}
		}
	}
	page, errPage := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, errLimit := strconv.Atoi(c.DefaultQuery("limit", strconv.Itoa(defaultLimit)))
	if errPage != nil || errLimit != nil || page < 1 || limit < 1 || limit > maxLimit {
		apiresp.Err(c, http.StatusBadRequest, "page must be >= 1 and limit between 1 and 200")
		return
	}

	list, total, err := m.store.ListTransactions(c.Request.Context(), ListFilter{
		UMKMID:        claims.UMKMID,
		BranchID:      c.Query("branch_id"),
		CashierID:     c.Query("cashier_id"),
		PaymentMethod: c.Query("payment_method"),
		Status:        c.Query("status"),
		From:          c.Query("from"),
		To:            c.Query("to"),
		Limit:         limit,
		Offset:        (page - 1) * limit,
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.Paginated(c, "Transactions retrieved", list, page, limit, total)
}

func (m *Module) handleGetTransaction(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	t, err := m.store.GetTransaction(c.Request.Context(), claims.UMKMID, c.Param("id"))
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	apiresp.OK(c, "Transaction retrieved", t)
}
