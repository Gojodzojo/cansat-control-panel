import { currentFrameNumberState, isPausedState, isRunningState, flightDataState } from "."
import { SimData } from "./flightProperties"
import { doPhysics, setVariables } from "./wasmImport"

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const simulate = async () => {    
    const {canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate, frames} = flightDataState.getValue() as SimData
    isPausedState.setValue(false)
    setVariables(canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate)
    currentFrameNumberState.setValue(-1)    

    while(isRunningState.getValue()) {
        const frameStart = performance.now()
        if(!isPausedState.getValue()) {
            if( frames[frames.length - 1] !== undefined && frames[frames.length - 1].position.y <= 0 ) {
                isPausedState.setValue(true)
            }
            else {
                frames.push( doPhysics() )
                currentFrameNumberState.setValue(frames.length - 1)
            }        
        }
        await delay((1/frameRate) - (performance.now() - frameStart))
    }
    
    currentFrameNumberState.setValue(undefined)
    frames.length = 0
}