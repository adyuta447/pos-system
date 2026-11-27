package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"pos-system/backend/internal/app"
	"pos-system/backend/internal/platform/config"
)

func main() {
	cfg := config.Load()

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           app.NewRouter(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		log.Printf("API listening on :%s (env=%s)", cfg.Port, cfg.AppEnv)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}
}
