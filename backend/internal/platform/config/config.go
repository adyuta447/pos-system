package config

import (
	"os"
	"strconv"
	"time"
)

// Config holds application-level configuration loaded from environment variables.
type Config struct {
	Port        string
	AppEnv      string
	DatabaseURL string
	JWTSecret   string
	JWTExpiry   time.Duration
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
	mins := 60 * 24 // 24h default
	if v := os.Getenv("JWT_EXPIRY_MINUTES"); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil && parsed > 0 {
			mins = parsed
		}
	}
	return Config{
		Port:        getEnv("PORT", "8080"),
		AppEnv:      getEnv("APP_ENV", "development"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://pos:pos_secret@localhost:5433/pos_umkm?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "dev-secret-change-in-production"),
		JWTExpiry:   time.Duration(mins) * time.Minute,
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
