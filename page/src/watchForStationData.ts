import { currentFrameNumberState, flightDataState } from "."
import { DataFrame, OperationCode, MessageFrame } from "./flightProperties"

export let stopStation = async () => console.error("Error in watchForStationData.ts")
export let sendStationMessage = async (messageFrame: MessageFrame) => console.error("Error in watchForStationData.ts")

export async function startStation(device: any) {
    currentFrameNumberState.setValue(-1)
    flightDataState.setValue({frames: [], messageFrames: []})

    await device.open({ baudRate: 115200 })
    const writer = (device.writable as WritableStream<Uint8Array>).getWriter()
    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)
    const reader = textDecoder.readable.getReader();    
    let jsonString = "", isRunning = true

    stopStation = async () => {
        isRunning = false
        reader.cancel()
        await readableStreamClosed.catch(() => { /* Ignore the error */ })
        writer.releaseLock()
        await device.close()
    }

    sendStationMessage = async (messageFrame: MessageFrame) => {
        await writer.write(messageFrame.toBytes())
    }

    while(isRunning) {
        const { value, done } = await reader.read();
        if(done) {
            reader.releaseLock()
            break
        }
        jsonString += value                
        if(jsonString.charAt(jsonString.length - 1) === "}") {
            try {
                const { frames, messageFrames } = flightDataState.getValue()
                const result: DataFrame = JSON.parse(jsonString)
                if(result.operationCode !== OperationCode.nothing) {
                    if(result.operationCode === OperationCode.error) {
                        messageFrames[messageFrames.length - 1].state = "Error"
                    }
                    else {
                        for(let i = messageFrames.length - 1; i >= 0; i--) {
                            if(messageFrames[i].messageFrame.operationCode === result.operationCode) {
                                messageFrames[i].state = "Delivered"
                                break
                            }
                        }
                    }        
                }
                frames.push(result)
                currentFrameNumberState.setValue(frames.length - 1)
            }
            catch(err) {
                console.log(err)
            }
            jsonString = ""
        }
    }    
}