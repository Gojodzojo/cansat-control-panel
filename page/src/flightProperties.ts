export interface Vector {
    x: number,
    y: number,
    z: number
}

export class PositionOrder {
    readonly code = 1
    delivered = false 
    constructor(
        public longitude: number,
        public latitude: number,        
    ){}
}

export class AzimuthOrder {
    readonly code = 2
    delivered = false
    constructor(
        public newAzimuth: number,        
    ){}
}

export class EmergencyOrder {
    readonly code = 3
    delivered = false    
}

export type Order = PositionOrder | AzimuthOrder | EmergencyOrder

export class SimMetaData {    
    constructor(
        public calculationsRate: number = 30,
        public dataRate: number = 1,
        public initialLongitude: number = 0,
        public initialLatitude: number = 0,
        public initialHeight: number = 1000,
        public canSatMass: number = 0.3,
        public canSatSurfaceArea: number = 0.00759,
        public airCS: number = 0.3,
        public windSpeed: number = 2,
        public windAzimuth: number = 2,
    ){}    
}

export interface DataFrame {
    azimuth: number
    pressure: number
    temperature: number
    latitude: number
    longitude: number
    time: number
    height: number
    rssi: number
    message: number    
}

export class FlightData {
    constructor(
        public frames: DataFrame[] = [],
        public orders: Order[] = []
    ){} 
    
    getPosition(i: number): Vector {        
        return {
            x: (this.getLongitude(i) - this.getLongitude(0)) * 111,
            y: this.frames[i].height,
            z: (this.getLatitude(i) - this.getLatitude(0)) * 111
        }
    }
        
    getVelocity(i: number): Vector {        
        if(i === 0) {
            return {x: 0, y: 0, z: 0}
        }
        const deltaTime = this.getTime(i) - this.getTime(i - 1)
        const currentPos = this.getPosition(i)
        const prevPos = this.getPosition(i - 1)
        return {
            x: ( currentPos.x - prevPos.x ) / deltaTime,
            y: ( currentPos.y - prevPos.y ) / deltaTime,
            z: ( currentPos.z - prevPos.z ) / deltaTime,
        }
    }
    
    getAcceleration(i: number): Vector {
        if(i < 2) {
            return {x: 0, y: 0, z: 0}
        }
        const deltaTime = this.getTime(i) - this.getTime(i - 1)
        const currentVel = this.getVelocity(i)
        const prevVel = this.getVelocity(i - 1)
        return {
            x: ( currentVel.x - prevVel.x ) / deltaTime,
            y: ( currentVel.y - prevVel.y ) / deltaTime,
            z: ( currentVel.z - prevVel.z ) / deltaTime,
        }
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