import { currentFrameNumberState, flightDataState, isPausedState, isRunningState, serialWriterState } from "."
import { StationData } from "./flightProperties"
import { GlobalState } from "./globalState"

export const watchForData = async (device: any) => {
    await device.open({ baudRate: 115200 })

    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)
    const reader = textDecoder.readable.getReader();
    const writer = device.writable.getWriter()
    serialWriterState.setValue(writer, true);
    (flightDataState as GlobalState<StationData>).setValue({date: Date.now()})    
    const { frames, date } = flightDataState.getValue() as StationData
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
            jsonString += value                
            if(jsonString.charAt(jsonString.length - 1) === "}") {
                try {
                    const result = JSON.parse(jsonString)
                    result.time = Date.now() - date
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

    serialWriterState.setValue(undefined)
    reader.cancel()
    await readableStreamClosed.catch(() => { /* Ignore the error */ })
    writer.releaseLock()
    await device.close()

    currentFrameNumberState.setValue(undefined)
    frames.length = 0
}