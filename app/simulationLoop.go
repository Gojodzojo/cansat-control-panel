package main

import (
	"fmt"
	"math"
	"time"
)

func simulationLoop() {
	for true {
		for !active {
		}

		start := time.Now()

		if position.Y <= 0 {
			active = false
			position.Y = 0
		} else {
			velocity.add(&gravity)
			velocity.add(&windAcceleration)

			/* https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna */
			dragForceVal := 0.5 * airDensity * airCS * math.Pow(velocity.Y, 2)
			dragForce := Vector{0, dragForceVal, 0}
			velocity.add(&dragForce)

			position.add(&velocity)
		}

		flightTime++
		jsFunc("setCanSatPosition", position.toString())
		jsFunc("setVelocity", velocity.toString())
		jsFunc("setTime", fmt.Sprintf("%g", float32(flightTime)/frameRate))
		jsFunc("setPressure", fmt.Sprintf("%g", pressureFromHeight()))
		time.Sleep((time.Second / frameRate) - time.Since(start))
	}
}

func pressureFromHeight() float64 {
	return 101325 * math.Pow(1-2.25577*math.Pow(10, -5)*position.Y, 5.25588) / 100
}
