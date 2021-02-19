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

function getCheckSum(byteArray) {    
    let checkSum = byteArray[0];
    for(let i = 1; i < byteArray.length; i++) {
        checkSum ^= byteArray[i]
    }
    return checkSum
}

let simMetaData, leftEngineState, rightEngineState, heading, position, acceleration, velocity, time, simLoopNumber, messageBytes = [], windAcceleration, interval

const airDensity = 1.225
const gravityForceVal = 9.80665

onmessage = function({ data }) {

    if(data.action === "start") {      // Set simulation parameters and start simulation loop
        simMetaData = data.simMetaData
        const { windAzimuth, canSatSurfaceArea, windSpeed, canSatMass, initialHeight } = simMetaData
                
        leftEngineState = true
        rightEngineState = false
        heading = 0
        velocity = new Vector(0, 0, 0)
        position = new Vector(0, initialHeight, 0)        
        acceleration = new Vector(0, gravityForceVal * -1, 0)
        
        const rad = (windAzimuth + 180) / 180 * Math.PI
        windAcceleration = new Vector( Math.cos(rad), 0, Math.sin(rad) )
        console.log(windAcceleration)
        
        /* https://www.engineeringtoolbox.com/wind-load-d_1775.html */
        const windForceVal = 0.5 * canSatSurfaceArea * airDensity * Math.pow(windSpeed, 2)
        windAcceleration.multiplyByScalar(windForceVal);
        windAcceleration.multiplyByScalar(1 / canSatMass);
        
        time = 0
        simLoopNumber = simMetaData.satelliteSimulationInterval / simMetaData.environmentSimulationInterval
        interval = setInterval(environmentSimulation, simMetaData.environmentSimulationInterval)
    }
    // Stop simulation loop
    else if(data.action === "stop") {
        clearInterval(interval)
    }
    else if(data.action === "message") {
        messageBytes = [
            65,
            84,
            ...data.messageBytes,
            getCheckSum(data.messageBytes),
            59
        ]
    }
}

function environmentSimulation() {
    if (simMetaData.satelliteSimulationInterval / simMetaData.environmentSimulationInterval <= simLoopNumber) {
        Module._loop();
        time += simMetaData.satelliteSimulationInterval
        simLoopNumber = 0
    }
    simLoopNumber++

    if(leftEngineState) {        
        heading -= simMetaData.angularVelocity * (simMetaData.environmentSimulationInterval / 1000)
    }
    if(rightEngineState) {
        heading += simMetaData.angularVelocity * (simMetaData.environmentSimulationInterval / 1000)
    }

    if(heading >= 360) {
        heading -= 360
    }
    else if(heading < 0) {
        heading += 360
    }

    const rad = (heading + 180) * (Math.PI / 180)
    const forwardAcceleration = new Vector( Math.cos(rad), 0, Math.sin(rad))
    forwardAcceleration.multiplyByScalar(simMetaData.forwardAccelerationVal);
    
    velocity.addVector(acceleration, simMetaData.environmentSimulationInterval)
    velocity.addVector(windAcceleration, simMetaData.environmentSimulationInterval)
    velocity.addVector(forwardAcceleration, simMetaData.environmentSimulationInterval)
    position.addVector(velocity, simMetaData.environmentSimulationInterval)    

    // https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna
    const dragForceVal = 0.5 * airDensity * simMetaData.airCS * Math.pow(velocity._y, 2)
    acceleration._y = dragForceVal - gravityForceVal      
}

const earthRadius = 6371e3
const earthCircumference = Math.PI * 2 * earthRadius
const degPerMeter = 360 / earthCircumference

function getPressure() {
    return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * position._y, 5.25588) / 100
}

function getTemperature() {
    return 20
}

function getLatitude() {
    const bearing = Math.atan2(position._z, position._x) - Math.PI / 2
    const distance = Math.sqrt(simMetaData.initialLatitude * simMetaData.initialLatitude + simMetaData.initialLongitude * simMetaData.initialLongitude)
    return pointRadialDistance(simMetaData.initialLatitude, simMetaData.initialLongitude, bearing, distance).lat
}

function getLongitude() {        
    const bearing = Math.atan2(position._z, position._x) - Math.PI / 2
    const distance = Math.sqrt(simMetaData.initialLatitude * simMetaData.initialLatitude + simMetaData.initialLongitude * simMetaData.initialLongitude)
    return pointRadialDistance(simMetaData.initialLatitude, simMetaData.initialLongitude, bearing, distance).lon
    
}

function millis() {
    return time
}

function radio_available() {
    return messageBytes.length   
}

const rEarth = 6371.01 
const epsilon = 0.000001

function deg2rad(angle) {
    return angle*Math.PI/180
}

function rad2deg(angle) {
    return angle*180/Math.PI
}


function pointRadialDistance(lat1, lon1, bearing, distance) {
    const rlat1 = deg2rad(lat1)
    const rlon1 = deg2rad(lon1)
    const rbearing = deg2rad(bearing)
    const rdistance = distance / rEarth

    const rlat = Math.asin( Math.sin(rlat1) * Math.cos(rdistance) + Math.cos(rlat1) * Math.sin(rdistance) * Math.cos(rbearing) )

    let rlon
    if (Math.cos(rlat) === 0 || Math.abs(Math.cos(rlat)) < epsilon) {
        rlon=rlon1
    }
    else {
        rlon = ( (rlon1 - Math.asin( Math.sin(rbearing)* Math.sin(rdistance) / Math.cos(rlat) ) + Math.PI ) % (2*Math.PI) ) - Math.PI
    }
    const lat = rad2deg(rlat)
    const lon = rad2deg(rlon)
    return {lat, lon}
}