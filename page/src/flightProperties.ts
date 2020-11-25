import { Vector } from "./usefullStuff"

const earthRadius = 6371e3
const earthCircumference = Math.PI * 2 * earthRadius
const degPerMeter = 360 / earthCircumference

export interface SimProperties {
    canSatPosition: Vector,
    velocity: Vector,
    acceleration: Vector,
    azimuth: number
}

export interface SimFlightData {
    frameRate: number        
    initialLongitude: number
    initialLatitude: number
    initialHeight: number
    canSatMass: number
    canSatSurfaceArea: number
    airCS: number
    windSpeed: number
    windAzimuth: number
    properties: SimProperties[]
}

export const DefaultSimFlightData: SimFlightData = {
    frameRate: 30,
    initialLongitude: 0,
    initialLatitude: 0,
    initialHeight: 1000,
    canSatMass: 0.3,
    canSatSurfaceArea: 0.3,
    airCS: 1,
    windSpeed: 2,
    windAzimuth: 0,
    properties: []
}

export interface StationProperties {
    azimuth: number
    pressure: number,
    temperature: number,
    latitude: number,
    longitude: number,
    time: number
}

export interface StationFlightData {
    date: number
    properties: StationProperties[]
}

export const DefaultStationFlightData: StationFlightData = {
    date: 0,
    properties: []
}

export function getCanSatPosition(data: StationFlightData | SimFlightData, i: number): Vector {
    if("frameRate" in data) {
        return data.properties[i].canSatPosition
    }
    return {x: 0, y: 0, z: 0}
}

export function getVelocity(data: StationFlightData | SimFlightData, i: number): Vector {
    if("frameRate" in data) {
        return data.properties[i].velocity
    }
    return {x: 0, y: 0, z: 0}
}

export function getAcceleration(data: StationFlightData | SimFlightData, i: number): Vector {
    if("frameRate" in data) {
        return data.properties[i].acceleration
    }
    return {x: 0, y: 0, z: 0}
}

export function getAzimuth(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return data.properties[i].azimuth
    }
    return data.properties[i].azimuth
}

export function getPressure(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * data.properties[i].canSatPosition.y, 5.25588) / 100
    }
    return data.properties[i].pressure
}

export function getTemperature(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return 0
    }
    return data.properties[i].temperature
}

export function getLatitude(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return data.initialLongitude + data.properties[i].canSatPosition.x * degPerMeter
    }
    return data.properties[i].latitude
}

export function getLongitude(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return data.initialLatitude + data.properties[i].canSatPosition.z * degPerMeter
    }
    return data.properties[i].longitude
}

export function getTime(data: StationFlightData | SimFlightData, i: number): number {
    if("frameRate" in data) {
        return i / data.frameRate    
    }
    return data.properties[i].time
}