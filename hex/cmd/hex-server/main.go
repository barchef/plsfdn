package main

import (
	"gitlab.com/bitcoinhex/hextra/pkg/app"
	"gitlab.com/bitcoinhex/hextra/pkg/config"
)

func main() {
	cfg := config.GetConfig()
	app.Serve(cfg.ServerBind)

	// Block the main goroutine indefinitely
	select {}
}
