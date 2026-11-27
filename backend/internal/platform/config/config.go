package config

import "os"

// Config holds application-level configuration loaded from environment variables.
type Config struct {
	Port        string
	AppEnv      string
	DatabaseURL string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
	return Config{
		Port:        getEnv("PORT", "8080"),
		AppEnv:      getEnv("APP_ENV", "development"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://pos:pos_secret@localhost:5432/pos_umkm?sslmode=disable"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
