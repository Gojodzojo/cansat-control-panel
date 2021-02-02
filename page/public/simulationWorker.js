/* eslint-disable no-undef */
importScripts("wasm/a.out.js")
wasmBinaryFile = "wasm/a.out.wasm"

class Vector {    
    constructor(x, y, z) {
        this._x = x
        this._y = y
        this._z = z
    }    

    addVector(v, deltaTime) {
        this._x += v._x / deltaTime
        this._y += v._y / deltaTime
        this._z += v._z / deltaTime
    }
}

let intervals = []
let simMetaData, leftEngineState, rightEngineState, heading, position, windForce, acceleration, velocity, startTime

onmessage = function({ data }) {

    if(data.action === "start") {        // Set simulation parameters and start simulation loop
        simMetaData = data.simMetaData
        position = new Vector(0, 10, 0)
        velocity = new Vector(0, 0, 0)
        acceleration = new Vector(0, 0, 0)
        windForce = new Vector(0, 0, 0)
        startTime = Date.now()
        intervals[0] = setInterval(environmentSimulation, 10)
        intervals[1] = setInterval(satelliteSimulation, 1000)
    }
    // Stop simulation loop
    else if(data.action === "stop") {
        intervals.forEach(clearInterval)        
    }
    else if(data.action === "message") {

    }
}

function environmentSimulation() {

}

function satelliteSimulation() {
    Module._loop();
}

const earthRadius = 6371e3
const earthCircumference = Math.PI * 2 * earthRadius
const degPerMeter = 360 / earthCircumference

function getPressure(i) {
    return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * position._y, 5.25588) / 100
}

function getTemperature() {
    return 20
}

function getLatitude() {
    return simMetaData.initialLongitude + position._x * degPerMeter        
}

function getLongitude() {        
    return simMetaData.initialLatitude + position._z * degPerMeter
}

function milis() {
    return Date.now() - startTime
}