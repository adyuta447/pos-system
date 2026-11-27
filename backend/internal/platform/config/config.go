package config

import "os"

// Config holds application-level configuration loaded from environment variables.
type Config struct {
	Port   string
	AppEnv string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
	return Config{
		Port:   getEnv("PORT", "8080"),
		AppEnv: getEnv("APP_ENV", "development"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
