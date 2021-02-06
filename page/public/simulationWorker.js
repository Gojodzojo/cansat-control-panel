importScripts("wasm/a.out.js")
wasmBinaryFile = "wasm/a.out.wasm"

class Vector {    
    constructor(x, y, z) {
        this._x = x
        this._y = y
        this._z = z
    }    

    addVector(v, deltaTime) {
        const secondFraction = deltaTime / 1000
        this._x += v._x * secondFraction
        this._y += v._y * secondFraction
        this._z += v._z * secondFraction
    }

    multiplyByScalar(s) {
        this._x *= s
        this._y *= s
        this._z *= s
    }
}

let interval
let simMetaData, leftEngineState, rightEngineState, heading, position, acceleration, velocity, startTime, simLoopNumber, messageBytes = []

const airDensity = 1.225
const gravityForceVal = 9.80665

onmessage = function({ data }) {

    if(data.action === "start") {      // Set simulation parameters and start simulation loop
        simMetaData = data.simMetaData
        const { windAzimuth, canSatSurfaceArea, windSpeed, canSatMass, initialHeight } = simMetaData        
        
        startTime = Date.now()

        const rad = windAzimuth * (Math.PI / 180)
        const windAcceleration = new Vector( Math.cos(rad) * -1, 0, Math.sin(rad) * -1 )        
        if (windAzimuth <= 180) {
            windAcceleration.multiplyByScalar(-1)
        }
        
        /* https://www.engineeringtoolbox.com/wind-load-d_1775.html */
        const windForceVal = 0.5 * canSatSurfaceArea * airDensity * Math.pow(windSpeed, 2);
        windAcceleration.multiplyByScalar(windForceVal);
        windAcceleration.multiplyByScalar(1 / canSatMass);
        
        acceleration = windAcceleration;
        acceleration._y = gravityForceVal * -1;        
        
        velocity = new Vector(0, 0, 0)
        position = new Vector(0, initialHeight, 0)
        simLoopNumber = simMetaData.satelliteSimulationInterval / simMetaData.environmentSimulationInterval
        
        interval = setInterval(environmentSimulation, simMetaData.environmentSimulationInterval)        
    }
    // Stop simulation loop
    else if(data.action === "stop") {
        clearInterval(interval)
    }
    else if(data.action === "message") {
        messageBytes = [ ...data.messageBytes ]
    }
}

function environmentSimulation() {
    if (simMetaData.satelliteSimulationInterval / simMetaData.environmentSimulationInterval <= simLoopNumber) {
        Module._loop();
        simLoopNumber = 0
    }
    simLoopNumber++

    velocity.addVector(acceleration, simMetaData.environmentSimulationInterval)
    position.addVector(velocity, simMetaData.environmentSimulationInterval)    

    // https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna
    const dragForceVal = 0.5 * airDensity * simMetaData.airCS * Math.pow(velocity._y, 2)
    acceleration._y = dragForceVal - gravityForceVal      
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

function millis() {
    return Date.now() - startTime
}

function radio_available() {
    return messageBytes.length   
}

