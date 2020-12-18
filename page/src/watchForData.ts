import { currentFrameNumberState, flightDataState, isPausedState, isRunningState } from "."
import { StationData } from "./flightProperties"
import { GlobalState } from "./globalState"

export const watchForData = async () => {
    const device = await (navigator as any).serial.requestPort()
    await device.open({ baudRate: 115200 })

    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)
    const reader = textDecoder.readable.getReader();
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

    reader.cancel();
    await readableStreamClosed.catch(() => { /* Ignore the error */ });    
    await device.close()

    currentFrameNumberState.setValue(undefined)
    frames.length = 0
}