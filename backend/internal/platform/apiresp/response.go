package apiresp

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// Envelope is the standard API response wrapper.
type Envelope struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
	Meta    *Meta  `json:"meta,omitempty"`
	Status  int    `json:"status"`
}

// Meta describes offset pagination metadata.
type Meta struct {
	CurrentPage int  `json:"current_page"`
	PerPage     int  `json:"per_page"`
	Total       int  `json:"total"`
	LastPage    int  `json:"last_page"`
	From        *int `json:"from"`
	To          *int `json:"to"`
}

func OK(c *gin.Context, message string, data any) {
	c.JSON(http.StatusOK, Envelope{Message: message, Data: data, Status: http.StatusOK})
}

func Created(c *gin.Context, message string, data any) {
	c.JSON(http.StatusCreated, Envelope{Message: message, Data: data, Status: http.StatusCreated})
}

func Paginated(c *gin.Context, message string, data any, page, perPage, total int) {
	lastPage := 1
	if total > 0 && perPage > 0 {
		lastPage = (total + perPage - 1) / perPage
	}
	var fromPtr, toPtr *int
	if total > 0 {
		from := (page-1)*perPage + 1
		to := min(page*perPage, total)
		if from <= total {
			fromPtr = &from
			toPtr = &to
		}
	}
	c.JSON(http.StatusOK, Envelope{
		Message: message,
		Data:    data,
		Meta: &Meta{
			CurrentPage: page,
			PerPage:     perPage,
			Total:       total,
			LastPage:    lastPage,
			From:        fromPtr,
			To:          toPtr,
		},
		Status: http.StatusOK,
	})
}

func Err(c *gin.Context, status int, message string) {
	c.JSON(status, Envelope{Message: message, Data: nil, Status: status})
}

// BindJSON binds JSON into dst, returning 422 for validation errors and 400 for malformed JSON.
func BindJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		writeBindErr(c, err)
		return false
	}
	return true
}

// BindOptionalJSON binds JSON into dst, allowing an empty body (io.EOF).
func BindOptionalJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil && !errors.Is(err, io.EOF) {
		writeBindErr(c, err)
		return false
	}
	return true
}

func writeBindErr(c *gin.Context, err error) {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		errs := make(map[string][]string, len(ve))
		for _, fe := range ve {
			field := toSnakeCase(fe.Field())
			errs[field] = append(errs[field], formatFieldErr(fe))
		}
		c.JSON(http.StatusUnprocessableEntity, Envelope{
			Message: "Validation failed",
			Data:    gin.H{"errors": errs},
			Status:  http.StatusUnprocessableEntity,
		})
		return
	}
	Err(c, http.StatusBadRequest, "Bad request")
}

func formatFieldErr(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "Field is required"
	case "email":
		return "Must be a valid email"
	case "min":
		return "Must be at least " + fe.Param() + " characters"
	case "max":
		return "Must be at most " + fe.Param() + " characters"
	case "oneof":
		return "Must be one of: " + fe.Param()
	case "url":
		return "Must be a valid URL"
	default:
		return "Invalid value"
	}
}

func toSnakeCase(s string) string {
	var b strings.Builder
	runes := []rune(s)
	for i, r := range runes {
		if unicode.IsUpper(r) {
			if i > 0 && (unicode.IsLower(runes[i-1]) || (i+1 < len(runes) && unicode.IsLower(runes[i+1]))) {
				b.WriteByte('_')
			}
			b.WriteRune(unicode.ToLower(r))
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}
