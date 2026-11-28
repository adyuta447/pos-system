package reporting

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/authctx"
)

const dateLayout = "2006-01-02"

func writeStoreErr(c *gin.Context, err error) {
	if errors.Is(err, ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
}

// handleSummary serves the owner dashboard: all branches, or one branch via ?branch_id= for drill-down.
func (m *Module) handleSummary(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	from, errFrom := time.Parse(dateLayout, c.Query("from"))
	to, errTo := time.Parse(dateLayout, c.Query("to"))
	if errFrom != nil || errTo != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "from and to are required in YYYY-MM-DD format"})
		return
	}
	if to.Before(from) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "to must not be before from"})
		return
	}
	period := c.DefaultQuery("period", "daily")
	if period != "daily" && period != "monthly" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "period must be daily or monthly"})
		return
	}
	sum, err := m.store.Summary(c.Request.Context(), SummaryFilter{
		UMKMID:   claims.UMKMID,
		BranchID: c.Query("branch_id"),
		From:     from.Format(dateLayout),
		To:       to.Format(dateLayout),
		Period:   period,
	})
	if err != nil {
		writeStoreErr(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"summary": sum})
}
