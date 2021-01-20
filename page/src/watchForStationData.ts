import { currentFrameNumberState, flightDataState, isPausedState, isRunningState, serialWriterState } from "."
import { DataFrame } from "./flightProperties"

export const watchForStationData = async (device: any) => {
    //prepare port for reading data
    await device.open({ baudRate: 115200 })
    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)
    const reader = textDecoder.readable.getReader()

    //prepare port for writing data
    const writer = device.writable.getWriter()
    serialWriterState.setValue(writer, true)

    // Set app initial values when starting receiving data
    const { frames } = flightDataState.getValue()
    isPausedState.setValue(false)
    currentFrameNumberState.setValue(-1)    
    let jsonString = ""

    while(isRunningState.getValue()) {
        if(!isPausedState.getValue()) {        
            const { value, done } = await reader.read();
            if(done) {
                reader.releaseLock()
                break
            }

            if(value !== undefined && (jsonString.charAt(0) === "{" || value.charAt(0) === "{")) {
                jsonString += value
            }

            if(jsonString.charAt(jsonString.length - 1) === "}") {
                try {
                    const result: DataFrame = JSON.parse(jsonString)
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

    //close device
    serialWriterState.setValue(undefined)
    reader.cancel()
    await readableStreamClosed.catch(() => { /* Ignore the error */ })
    writer.releaseLock()
    await device.close()

    //delete data
    currentFrameNumberState.setValue(undefined)
    frames.length = 0
}