export interface Vector {
    x: number,
    y: number,
    z: number
}

export enum OperationCode {
    error = -1,
    nothing = 0,
    position = 1,
    azimuth = 2,
    emergency = 3,
    calibration = 4,
    wait = 5
};

export class MessageFrame {
    constructor(
        readonly operationCode: OperationCode
    ){}
    
    toBytes() {
        return new Uint8Array( new Int8Array([ this.operationCode ]).buffer )
    }
}

export class PositionMessageFrame extends MessageFrame {
    constructor(
        public longitude: number,
        public latitude: number,        
    ){ super(OperationCode.position) }

    toBytes() {
        return new Uint8Array([
            ...new Uint8Array( new Int8Array([ this.operationCode ]).buffer ),
            ...new Uint8Array( new Int32Array([
                this.longitude * Math.pow(10, 6),
                this.latitude * Math.pow(10, 6)
            ]).buffer )
        ])
    }
}

export class AzimuthMessageFrame extends MessageFrame {
    constructor(
        public azimuth: number,        
    ){ super(OperationCode.azimuth) }

    toBytes() {        
        return new Uint8Array([
            ...new Uint8Array( new Int8Array([ this.operationCode ]).buffer ),
            ...new Uint8Array( new Int32Array([ this.azimuth ]).buffer )
        ])
    }
}

export class FlightDataMessageFrame {
    state: "Delivered" | "Not delivered" | "Error" = "Not delivered"

    constructor(
        public messageFrame: MessageFrame
    ){}
}

export class SimMetaData {    
    constructor(
        public initialLongitude: number = 0,
        public initialLatitude: number = 0,
        public initialHeight: number = 1000,
        public canSatMass: number = 0.3,
        public canSatSurfaceArea: number = 0.00759,
        public airCS: number = 0.3,
        public windSpeed: number = 2,
        public windAzimuth: number = 2,
        public environmentSimulationInterval: number = 10,
        public satelliteSimulationInterval: number = 1000,
        public forwardAccelerationVal: number = 10,
        public angularVelocity: number = 20
    ){}    
}

export interface DataFrame {
    heading: number
    pressure: number
    temperature: number
    latitude: number
    longitude: number
    time: number
    height: number
    rssi: number
    operationCode: OperationCode
}

export class FlightData {
    constructor(
        public frames: DataFrame[] = [],
        public messageFrames: FlightDataMessageFrame[] = []
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
            return {x: 0, y: -10, z: 0}
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
    
    getHeading(i: number): number {    
        return this.frames[i].heading
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
        return this.frames[i].time / 1000
    }   
    
    getRssi(i: number): number {
        return this.frames[i].rssi
    }
}