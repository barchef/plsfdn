package main

import (
	"gitlab.com/pulsechaincom/pulsex-server/pkg/app"
	"gitlab.com/pulsechaincom/pulsex-server/pkg/config"
)

func main() {
	cfg := config.GetConfig()
	app.Serve(cfg.ServerBind)

	// Block the main goroutine indefinitely
	select {}
}
