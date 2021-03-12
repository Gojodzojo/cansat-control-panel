import { currentFrameNumberState, flightDataState, simMetaDataState } from "./index"
import { DataFrame, OperationCode, MessageFrame, SimMetaData } from "./flightProperties"

export type MessageData = {
    action: "start"
    simMetaData: SimMetaData
} | {
    action: "message"
    messageBytes: Uint8Array
} | {
    action: "stop"
}

const worker = new Worker("./simulationWorker.js")

function readData({ data }: MessageEvent<DataFrame>) {
    const { frames, messageFrames } = flightDataState.getValue()
    if(data.operationCode !== OperationCode.nothing) {
        if(data.operationCode === OperationCode.error) {
            messageFrames[messageFrames.length - 1].state = "Error"
        }
        else {
            for(let i = messageFrames.length - 1; i >= 0; i--) {
                if(messageFrames[i].messageFrame.operationCode === data.operationCode) {
                    messageFrames[i].state = "Delivered"
                    break
                }
            }
        }        
    }
    frames.push(data)
    currentFrameNumberState.setValue(frames.length - 1)
}

export function startSimulator() {    
    currentFrameNumberState.setValue(-1)
    flightDataState.setValue({frames: [], messageFrames: []})
    worker.addEventListener("message", readData)

    // Set information about environment and satellite and start the simulation loop     
    worker.postMessage({
        action: "start",
        simMetaData: simMetaDataState.getValue()
    } as MessageData)
}

export function stopSimulation() {
    worker.postMessage({ action: "stop" } as MessageData)
    worker.removeEventListener("message", readData)    
}

export function sendSimulatorMessage(messageFrame: MessageFrame) {
    worker.postMessage({ action: "message", messageBytes: messageFrame.toBytes() } as MessageData)
}