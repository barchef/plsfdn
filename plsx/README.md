# pulsex-server

You're one step away from setting up your own instance of app.pulsex.com on your local machine. Choose the method that suits you best:

1. 📦 Use a Pre-built Binary: We offer pre-built binaries for various distributions, listed below.
2. 🔧 Build from Source: If you prefer, you can clone this repository and compile your own binary.

## 📦 Available Pre-built Binaries:
Downloads: https://gitlab.com/pulsechaincom/pulsex-server/-/releases

| Package                                | Intel (amd64) | ARM (arm64) |
|----------------------------------------|:-------------:|:-----------:|
| MacOS.zip                              |       x       |      x      |
| pulsex-server_1.0.0_windows_amd64.zip  |       x       |             |
| pulsex-server_1.0.0_windows_arm64.zip  |               |      x      |
| pulsex-server_1.0.0_linux_arm64.tar.gz |               |      x      |
| pulsex-server_1.0.0_linux_amd64.tar.gz |       x       |             |

### ⚠️ Important Notice for MacOS Users ⚠️
MacOS mandates the use of digitally signed binaries, which prevents us from directly distributing the binary for this platform.

🔹 Alternate Solution: We provide a `MacOS.zip` package. Upon installation, it sets up a lightweight webserver, enabling you to seamlessly run the website.

🔹 For Advanced Users: If you wish to run the same binary as other operating systems, proceed below to build from source.

## 🔧 Building From Source 

### 1. Install Golang dependencies
[Go 1.21](https://go.dev/doc/install) or newer is required to build the PulseX server.

Follow the official instructions on https://go.dev/doc/install to install Go for your OS.

#### Alternatively, you can use a package manager to install Go:
- MacOS users can use [Homebrew](https://brew.sh/) to install the [golang formula](https://formulae.brew.sh/formula/go).
- Windows users can use [Chocolatey](https://community.chocolatey.org/) to install the [golang package](https://community.chocolatey.org/packages/golang).
- Linux users can check the package manager for their distro of choice for available packages.

### 2. Build the executable
```bash
git clone https://gitlab.com/pulsechaincom/pulsex-server.git
cd pulsex-server
go build -o pulsex-server ./cmd/pulsex-server/main.go

# Run the built binary
./pulsex-server
```
> **Note:** Windows users may want to add the `.exe` file extension to the output file name in the go build command above.
