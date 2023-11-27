package main

import (
	"gitlab.com/pulsechaincom/pulsechain-explorer-server/pkg/app"
	"gitlab.com/pulsechaincom/pulsechain-explorer-server/pkg/config"
)

func main() {
	cfg := config.GetConfig()
	app.Serve(cfg.ServerBind)

	// Block the main goroutine indefinitely
	select {}
}
