package app

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os/exec"
	"runtime"

	"github.com/sirupsen/logrus"
)

//go:embed all:dist
var staticFiles embed.FS

func Serve(addr string) {
	url := fmt.Sprintf("http://%s", addr)
	subFS, _ := fs.Sub(staticFiles, "dist")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Serve the embedded PulseX files
		http.FileServer(http.FS(subFS)).ServeHTTP(w, r)
	})

	ready := make(chan struct{})
	logrus.Info("Starting PulseX server")

	// Start the Go HTTP server in a separate goroutine
	go func() {
		// Start listening
		l, err := net.Listen("tcp", addr)
		if err != nil {
			logrus.Fatalf("Failed to start server: %s", err)
		}

		// Signal readiness
		ready <- struct{}{}

		// Serve the static site
		if err := http.Serve(l, nil); err != nil {
			logrus.Fatalf("Failed to start server: %s", err)
		}
	}()

	// Wait for startup
	<-ready
	logrus.Infof("You can access the PulseX server at: %s", url)

	// Open the URL in the default browser
	if err := openBrowser(url); err != nil {
		logrus.Errorf("Failed to open browser: %s", err)
	}
}

func openBrowser(url string) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	case "linux":
		cmd = exec.Command("xdg-open", url)
	default:
		return fmt.Errorf("unsupported platform")
	}

	return cmd.Start()
}
