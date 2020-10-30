package main

import (
	"encoding/json"
	"math"
	"time"
)

func simulationLoop() {
	for true {
		for !active {
		}

		start := time.Now()

		flightProperties.Velocity.add(&gravity)
		flightProperties.Velocity.add(&windAcceleration)

		/* https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna */
		dragForceVal := 0.5 * airDensity * airCS * math.Pow(flightProperties.Velocity.Y, 2)
		dragForce := Vector{0, dragForceVal, 0}
		flightProperties.Velocity.add(&dragForce)

		flightProperties.CanSatPosition.add(&flightProperties.Velocity)

		if flightProperties.CanSatPosition.Y <= 0 {
			active = false
			flightProperties.CanSatPosition.Y = 0
		}

		flightProperties.Time += 1.0 / frameRate
		flightProperties.Pressure = pressureFromHeight()

		bytes, err := json.Marshal(flightProperties)
		if err != nil {
			panic(err)
		}
		jsFunc("setFlightProperties", string(bytes))
		time.Sleep((time.Second / frameRate) - time.Since(start))
	}
}

func pressureFromHeight() float32 {
	return 101325 * float32(math.Pow(1-2.25577*math.Pow(10, -5)*flightProperties.CanSatPosition.Y, 5.25588)) / 100
}
