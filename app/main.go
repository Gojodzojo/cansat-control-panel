package main

import (
	"encoding/json"
	"log"
	"lorca"
	"math"
	"strings"
)

const (
	frameRate  = 60
	airDensity = 1.225
)

type FlightProperties struct {
	CanSatPosition Vector  `json:"canSatPosition"`
	Velocity       Vector  `json:"velocity"`
	Pressure       float32 `json:"pressure"`
	Time           float32 `json:"time"`
}

var (
	gravity          Vector
	windAcceleration Vector
	canSatMass       float64
	airCS            float64
	active           bool
	ui               lorca.UI
	flightProperties FlightProperties
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

		//jsVar("flightProperties.last()").To(&flightProperties)
		flightProperties = FlightProperties{}
		flightProperties.CanSatPosition.Y = float64(jsVar("originalHeight").Float())
		flightProperties.Pressure = pressureFromHeight()

		bytes, err := json.Marshal(flightProperties)
		if err != nil {
			panic(err)
		}
		jsFunc("setFlightProperties", string(bytes))

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
