import { getGlobalState, setGlobalState } from "."
import { SimFlightData, SimProperties } from "./flightProperties"
import { doPhysics, setVariables } from "./wasmImport"

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const simulate = async () => {    
    const {canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate} = getGlobalState("flightProperties") as SimFlightData
    setVariables(canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate)
    setGlobalState("currentFrameNumber", -1)    

    while(getGlobalState("isRunning")) {
        while(getGlobalState("isPaused")){}
        const frameStart = performance.now()  
        const result = doPhysics() as SimProperties
        const flightProperties = getGlobalState("flightProperties") as SimFlightData
        setGlobalState("flightProperties", {
            ...flightProperties,
            properties: [...flightProperties.properties, result]
        })
        setGlobalState("currentFrameNumber", 1 + (getGlobalState("currentFrameNumber") as number))        
        await delay((1/frameRate) - (performance.now() - frameStart))
    }
    
    setGlobalState("currentFrameNumber", undefined)
    const flightProperties = getGlobalState("flightProperties") as SimFlightData
    const properties: SimProperties[] = []
    setGlobalState("flightProperties", {
        ...flightProperties,
        properties
    })
}

// export const simulate = () => {            
//     console.time("loop")
//     const result = doPhysics() as SimProperties
//     /*const flightProperties = window.flightPropertiesState.getValue() as SimFlightData
//     window.flightPropertiesState.setValue({
//         ...flightProperties,
//         properties: [...flightProperties.properties, result]
//     } as SimFlightData)
//     window.currentFrameNumberState.setValue(1 + (window.currentFrameNumberState.getValue() as number))*/
//     console.timeEnd("loop")
    

//     /*const flightProperties = window.flightPropertiesState.getValue() as SimFlightData
//     window.currentFrameNumberState.setValue(undefined)
//     window.flightPropertiesState.setValue({
//         ...flightProperties,
//         properties: []
//     } as any as SimFlightData)*/
// }

/*let position: Vector = {x: 0, y: 1000, z: 0}
let velocity: Vector = {x: 0, y: 0, z: 0}
let acceleration: Vector = {x: 0, y: 0, z: 0}
const airDensity = 1.225
const gravityForceVal = 9.80665

function doPhysics(): SimProperties {    
    const {airCS} = window.flightPropertiesState.getValue() as SimFlightData
    velocity = addVectors(velocity, acceleration);
    position = addVectors(position, velocity);  

    // https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna
    const dragForceVal = 0.5 * airDensity * airCS * Math.pow(velocity.y, 2);   
    acceleration.y = (dragForceVal - gravityForceVal);
    
    return {
        velocity,
        canSatPosition: position,
        acceleration,
        azimuth: 0
    }
}*/