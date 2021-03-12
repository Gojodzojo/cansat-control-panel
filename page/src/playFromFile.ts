import { currentFrameNumberState, flightDataState } from "."

export let stopPlayer = () => console.error("Error in watchForStationData.ts")

export async function startPlayer() {    
    let isRunning = true;

    stopPlayer = () => isRunning = false

    const {frames} = flightDataState.getValue()
    const iter = () => {
        const currentFrameNumber = currentFrameNumberState.getValue()
        setTimeout(() => {
            if(currentFrameNumber  + 1 > frames.length - 1 || !isRunning) {
                return
            }
            currentFrameNumberState.setValue( currentFrameNumber  + 1 )
            iter()
        }, frames[currentFrameNumber + 1].time - frames[currentFrameNumber].time);
    }
    iter()
}