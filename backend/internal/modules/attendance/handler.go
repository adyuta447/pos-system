package attendance

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"pos-system/backend/internal/platform/apiresp"
	"pos-system/backend/internal/platform/authctx"
)

const dateLayout = "2006-01-02"

// handleListAttendances lets the owner review cashier working hours across branches.
func (m *Module) handleListAttendances(c *gin.Context) {
	claims, _ := authctx.GetClaims(c)
	from, errFrom := time.Parse(dateLayout, c.Query("from"))
	to, errTo := time.Parse(dateLayout, c.Query("to"))
	if errFrom != nil || errTo != nil {
		apiresp.Err(c, http.StatusBadRequest, "from and to are required in YYYY-MM-DD format")
		return
	}
	if to.Before(from) {
		apiresp.Err(c, http.StatusBadRequest, "to must not be before from")
		return
	}
	list, err := m.store.ListAttendances(c.Request.Context(), ListFilter{
		UMKMID:   claims.UMKMID,
		BranchID: c.Query("branch_id"),
		StaffID:  c.Query("staff_id"),
		From:     from.Format(dateLayout),
		To:       to.Format(dateLayout),
	})
	if err != nil {
		apiresp.Err(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	apiresp.OK(c, "Attendances retrieved", list)
}
