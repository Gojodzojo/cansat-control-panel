import { flightProperties } from "."
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

export interface SimMetaData {
    frameRate: number        
    initialLongitude: number
    initialLatitude: number
    initialHeight: number
    canSatMass: number
    canSatSurfaceArea: number
    airCS: number
    windSpeed: number
    windAzimuth: number
}

export const DefaultSimMetaData: SimMetaData = {
    frameRate: 30,
    initialLongitude: 0,
    initialLatitude: 0,
    initialHeight: 1000,
    canSatMass: 0.3,
    canSatSurfaceArea: 0.3,
    airCS: 1,
    windSpeed: 2,
    windAzimuth: 0,
}

export interface StationProperties {
    azimuth: number
    pressure: number,
    temperature: number,
    latitude: number,
    longitude: number,
    time: number
}

export interface StationMetaData {
    date: number    
}

export const DefaultStationFlightData: StationMetaData = {
    date: 0
}

export function getCanSatPosition(i: number): Vector {
    if("canSatPosition" in flightProperties[0]) {
        return (flightProperties[i] as SimProperties).canSatPosition
    }
    return {x: 0, y: 0, z: 0}
}

export function getVelocity(i: number): Vector {
    if("canSatPosition" in flightProperties[0]) {
        return (flightProperties[i] as SimProperties).velocity
    }
    return {x: 0, y: 0, z: 0}
}

export function getAcceleration(i: number): Vector {
    if("canSatPosition" in flightProperties[0]) {
        return (flightProperties[i] as SimProperties).acceleration
    }
    return {x: 0, y: 0, z: 0}
}

export function getAzimuth(i: number): number {    
    return flightProperties[i].azimuth
}

export function getPressure(i: number): number {
    if("canSatPosition" in flightProperties[0]) {
        return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * (flightProperties[i] as SimProperties).canSatPosition.y, 5.25588) / 100
    }
    return (flightProperties[i] as StationProperties).pressure
}

export function getTemperature(i: number): number {
    if("canSatPosition" in flightProperties[0]) {
        return 0
    }
    return (flightProperties[i] as StationProperties).temperature
}

export function getLatitude(data: StationMetaData | SimMetaData, i: number): number {
    if("frameRate" in data) {
        return data.initialLongitude + (flightProperties[i] as SimProperties).canSatPosition.x * degPerMeter
    }
    return (flightProperties[i] as StationProperties).latitude
}

export function getLongitude(data: StationMetaData | SimMetaData, i: number): number {
    if("frameRate" in data) {
        return data.initialLatitude + (flightProperties[i] as SimProperties).canSatPosition.z * degPerMeter
    }
    return (flightProperties[i] as StationProperties).longitude
}

export function getTime(data: StationMetaData | SimMetaData, i: number): number {
    if("frameRate" in data) {
        return i / data.frameRate    
    }
    return (flightProperties[i] as StationProperties).time
}