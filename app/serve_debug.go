//go:generate go run -tags generate gen.go
//+build !debug

package main

func serve() (string, error) {
	return "http://127.0.0.1:5500/src/main.html", nil
}
