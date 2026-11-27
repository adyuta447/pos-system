package authctx

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims represents the authenticated web user context embedded in JWTs.
type Claims struct {
	UserID   string `json:"sub"`
	UMKMID   string `json:"umkm_id,omitempty"`
	BranchID string `json:"branch_id,omitempty"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken signs a JWT access token for the given claims.
func GenerateToken(secret string, c Claims, ttl time.Duration) (string, error) {
	now := time.Now()
	c.RegisteredClaims = jwt.RegisteredClaims{
		Subject:   c.UserID,
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, c).SignedString([]byte(secret))
}

// ParseToken validates and extracts Claims from a signed JWT string.
func ParseToken(secret, tokenStr string) (Claims, error) {
	var c Claims
	token, err := jwt.ParseWithClaims(tokenStr, &c, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return Claims{}, errors.New("invalid token")
	}
	return c, nil
}
