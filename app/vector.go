package main

import (
	"encoding/json"
	"sync"
)

type Vector struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

func (v Vector) toString() string {
	bytes, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return string(bytes)
}

func (v *Vector) multiplyByScalar(scalar float64) {
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		v.X *= scalar
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		v.Y *= scalar
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		v.Z *= scalar
		wg.Done()
	}()

	wg.Wait()
}

func (v *Vector) add(v2 *Vector) {
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		v.X += (v2.X / frameRate)
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		v.Y += (v2.Y / frameRate)
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		v.Z += (v2.Z / frameRate)
		wg.Done()
	}()

	wg.Wait()
}
