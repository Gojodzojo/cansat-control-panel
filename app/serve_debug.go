//go:generate go run -tags generate gen.go
//+build !debug

package main

func serve() (string, error) {
	return "http://localhost:3000/", nil
}
