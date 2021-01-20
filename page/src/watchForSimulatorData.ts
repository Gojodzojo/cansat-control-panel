import { currentFrameNumberState, isPausedState, isRunningState, flightDataState, simMetaDataState } from "."
import { receiveData, startSimulation, stopSimulation } from "./wasmImport"

export const watchForSimulatorData = async () => {    
    // Set information about environment and satellite and start the simulation loop
    const {canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight} = simMetaDataState.getValue()  
    startSimulation(canSatMass, airCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight)

    // Set app initial values when starting simulation
    const { frames } = flightDataState.getValue()
    isPausedState.setValue(false)
    currentFrameNumberState.setValue(-1)

    while(isRunningState.getValue()) {
        if(!isPausedState.getValue()) {                        
            const result = await receiveData()
            frames.push(result)
            currentFrameNumberState.setValue(frames.length - 1)
        }
    }
    
    stopSimulation()
    currentFrameNumberState.setValue(undefined)
    frames.length = 0
}