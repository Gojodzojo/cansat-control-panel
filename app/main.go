package main

import (
	"log"
	"lorca"
	"math"
	"strings"
)

const (
	frameRate  = 60
	airDensity = 1.225
)

var (
	gravity          Vector
	windAcceleration Vector
	position         Vector
	velocity         Vector
	canSatMass       float64
	airCS            float64
	flightTime       uint
	active           bool
	ui               lorca.UI
)

func main() {
	gravity = Vector{0, -9.80665, 0}
	active = false

	addr, err := serve()
	if err != nil {
		log.Fatal(err)
	}

	ui, _ = lorca.New(addr, "./user-data-dir", 1000, 1000)
	go simulationLoop()

	ui.Bind("startSimulation", func() {
		canSatMass = float64(jsVar("canSatMass").Float())
		airCS = float64(jsVar("airCS").Float())

		windSpeed := jsVar("windSpeed").Float()
		windAzimuth := jsVar("windAzimuth").Float()

		rad := deg2rad(float64(windAzimuth))
		windForce := Vector{math.Cos(rad) * -1, 0, math.Sin(rad) * -1}
		if windAzimuth <= 180 {
			windForce.multiplyByScalar(-1)
		}

		/* https://www.engineeringtoolbox.com/wind-load-d_1775.html */
		canSatSurfaceArea := jsVar("canSatSurfaceArea").Float()
		windForceVal := 0.5 * canSatSurfaceArea * airDensity * float32(math.Pow(float64(windSpeed), 2))
		windForce.multiplyByScalar(float64(windForceVal))
		windAcceleration = windForce
		windAcceleration.multiplyByScalar(1 / canSatMass)

		originalHeight := float64(jsVar("originalHeight").Float())
		position = Vector{0, originalHeight, 0}
		velocity = Vector{0, 0, 0}

		jsFunc("setTime", "0")
		flightTime = 0
		active = true
	})

	ui.Bind("pauseSimulation", func() {
		active = false
		jsFunc("setIsPaused", "true")
	})

	ui.Bind("resumeSimulation", func() {
		active = true
		jsFunc("setIsPaused", "false")
	})

	<-ui.Done()
}

func jsFunc(funcName string, arguments ...string) lorca.Value {
	jsCode := "contextValues." + funcName + "(" + strings.Join(arguments, ",") + ")"
	return ui.Eval(jsCode)
}

func jsVar(varName string) lorca.Value {
	return ui.Eval("contextValues." + varName)
}

func deg2rad(degAngle float64) float64 {
	return math.Pi * 2 * (degAngle / 360)
}
