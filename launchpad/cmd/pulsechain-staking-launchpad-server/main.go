package main

import (
	"pulsechaincom/pulsechain-staking-launchpad-server/pkg/app"
	"pulsechaincom/pulsechain-staking-launchpad-server/pkg/config"
)

func main() {
	cfg := config.GetConfig()
	app.Serve(cfg.ServerBind)

	// Block the main goroutine indefinitely
	select {}
}
