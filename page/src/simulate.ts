import { currentFrameNumberState, isPausedState, isRunningState, flightDataState } from "."
import { SimData } from "./flightProperties"
import { doPhysics, setVariables } from "./wasmImport"

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const simulate = async () => {    
    const {canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate, frames} = flightDataState.getValue() as SimData
    isPausedState.setValue(false, true)
    setVariables(canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate)
    currentFrameNumberState.setValue(-1, true)    

    while(isRunningState.getValue()) {
        const frameStart = performance.now()
        if(!isPausedState.getValue()) {
            if( frames[frames.length - 1] !== undefined && frames[frames.length - 1].position.y <= 0 ) {
                isPausedState.setValue(true, true)
            }
            else {
                frames.push( doPhysics() )
                currentFrameNumberState.setValue(frames.length - 1, true)
            }        
        }
        await delay((1/frameRate) - (performance.now() - frameStart))
    }
    
    currentFrameNumberState.setValue(undefined, true)
    frames.length = 0
}