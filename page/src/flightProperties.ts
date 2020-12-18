import { Vector } from "./usefullStuff"

const earthRadius = 6371e3
const earthCircumference = Math.PI * 2 * earthRadius
const degPerMeter = 360 / earthCircumference

export interface SimFrame {
    position: Vector,
    velocity: Vector,
    acceleration: Vector,
    azimuth: number
}

export class SimData {    
    constructor(
        public frameRate: number = 30,
        public initialLongitude: number = 0,
        public initialLatitude: number = 0,
        public initialHeight: number = 1000,
        public canSatMass: number = 0.3,
        public canSatSurfaceArea: number = 0.00759,
        public airCS: number = 0.3,
        public windSpeed: number = 2,
        public windAzimuth: number = 2,        
        public frames: SimFrame[] = []
    ){}    

    getPosition(i: number): Vector {        
        return this.frames[i].position
    }
    
    getVelocity(i: number): Vector {
        return this.frames[i].velocity
    }
    
    getAcceleration(i: number): Vector {
        return this.frames[i].acceleration
    }
    
    getAzimuth(i: number): number {    
        return this.frames[i].azimuth
    }
    
    getPressure(i: number): number {
        return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * this.frames[i].position.y, 5.25588) / 100
    }
    
    getTemperature(i: number): number {
        return i
    }
    
    getLatitude(i: number): number {
        return this.initialLongitude + this.frames[i].position.x * degPerMeter        
    }
    
    getLongitude(i: number): number {        
        return this.initialLatitude + this.frames[i].position.z * degPerMeter
    }
    
    getTime(i: number): number {        
        return i / this.frameRate    
    }
}

export interface StationFrame {
    azimuth: number
    pressure: number,
    temperature: number,
    latitude: number,
    longitude: number,
    time: number,
    height: number,
    rssi: number
}

export class StationData {
    constructor(
        public date: number = 0,
        public frames: StationFrame[] = []
    ){} 
    
    getPosition(i: number): Vector {        
        return {x: 0, y: this.frames[i].height, z: 0}
    }
    
    getVelocity(i: number): Vector {        
        return {x: 0, y: 0, z: 0}
    }
    
    getAcceleration(i: number): Vector {
        return {x: 0, y: 0, z: 0}
    }
    
    getAzimuth(i: number): number {    
        return this.frames[i].azimuth
    }
    
    getPressure(i: number): number {        
        return this.frames[i].pressure
    }
    
    getTemperature(i: number): number {
        return this.frames[i].temperature
    }
    
    getLatitude(i: number): number {
        return this.frames[i].latitude
    }
    
    getLongitude(i: number): number {
        return this.frames[i].longitude
    }
    
    getTime(i: number): number {
        return this.frames[i].time
    }
}