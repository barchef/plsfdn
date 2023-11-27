package main

import (
	"pulsechaincom/pulsechain-bridge-server/pkg/app"
	"pulsechaincom/pulsechain-bridge-server/pkg/config"
)

func main() {
	cfg := config.GetConfig()
	app.Serve(cfg.ServerBind)

	// Block the main goroutine indefinitely
	select {}
}
