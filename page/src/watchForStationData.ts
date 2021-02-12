import { currentFrameNumberState, flightDataState } from "."
import { DataFrame, MessageFrame } from "./flightProperties"

export let stopStation = async () => console.error("Error in watchForStationData.ts")
export let sendStationMessage = async (messageFrame: MessageFrame) => console.error("Error in watchForStationData.ts")

export async function startStation(device: any) {
    await device.open({ baudRate: 115200 })
    const writer = (device.writable as WritableStream<Uint8Array>).getWriter()
    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)
    const reader = textDecoder.readable.getReader();
    const { frames } = flightDataState.getValue()
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
                const result: DataFrame = JSON.parse(jsonString)
                result.time /= 1000
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