import { currentFrameNumberState, flightDataState } from "."
import { DataFrame, MessageFrame } from "./flightProperties"

function newJsonDecoder(){
    return new TransformStream<string, any>({
        start(controller: any) {
            controller.buf = ''
        },
        transform(chunk: any, controller: any) {                                  
            if(controller.buf[0] === "{" || chunk[0] === "{") {
                controller.buf += chunk
                if(controller.buf.charAt(controller.buf.length - 1) === "}") {
                    controller.enqueue(JSON.parse(controller.buf))
                    controller.buf = ""
                }
            }
        }
    })
}

function makeWriteableEventStream(eventTarget: EventTarget) {
    return new WritableStream({
        start() {
            eventTarget.dispatchEvent( new Event('start') )
        },
        write(data: DataFrame) {
            eventTarget.dispatchEvent( new MessageEvent("data", { data }) )
        },
        close() {
            eventTarget.dispatchEvent( new CloseEvent('close') )
        },
        abort(reason: string) {
            eventTarget.dispatchEvent( new CloseEvent('abort', { reason }) )
        }
    })
}

function readData({ data }: MessageEvent<DataFrame>) {
    const { frames } = flightDataState.getValue()
    data.time /= 1000
    frames.push(data)    
    currentFrameNumberState.setValue(frames.length - 1)
}

export let stopStation = async () => console.error("Error in watchForStationData.ts")
export let sendStationMessage = async (messageFrame: MessageFrame) => console.error("Error in watchForStationData.ts")

export async function startStation(device: any) {
    const eventTarget = new EventTarget()
    const writableEventStream = makeWriteableEventStream(eventTarget)
    
    await device.open({ baudRate: 115200 })
    const writer = (device.writable as WritableStream<Uint8Array>).getWriter()
    const readableStreamClosed = (device.readable as ReadableStream)
        .pipeThrough(new TextDecoderStream())
        .pipeThrough<DataFrame>(newJsonDecoder())
        .pipeTo(writableEventStream)

    eventTarget.addEventListener("data", readData as any)

    stopStation = async () => {
        eventTarget.removeEventListener("data", readData as any)
        writableEventStream.getWriter().releaseLock()
        writableEventStream.abort()
        await readableStreamClosed.catch(() => { /* Ignore the error */ })
        writer.releaseLock()      
        await device.close()
    }

    sendStationMessage = async (messageFrame: MessageFrame) => {
        await writer.write(messageFrame.toBytes())
    }
}

// export const watchForStationData = async (device: any) => {
//     //prepare port for reading data
//     await device.open({ baudRate: 115200 })
//     const textDecoder = new TextDecoderStream()
//     const readableStreamClosed = device.readable.pipeTo(textDecoder.writable)        
//     const reader = textDecoder.readable.getReader()

//     //prepare port for writing data
//     const writer = device.writable.getWriter()
//     serialWriterState.setValue(writer, true)

//     // Set app initial values when starting receiving data
//     const { frames } = flightDataState.getValue()
//     isPausedState.setValue(false)
//     currentFrameNumberState.setValue(-1)    
//     let jsonString = ""

//     while(isRunningState.getValue()) {
//         if(!isPausedState.getValue()) {        
//             const { value, done } = await reader.read();
//             if(done) {
//                 reader.releaseLock()
//                 break
//             }

//             if(value !== undefined && (jsonString.charAt(0) === "{" || value.charAt(0) === "{")) {
//                 jsonString += value
//             }

//             if(jsonString.charAt(jsonString.length - 1) === "}") {
//                 try {
//                     const result: DataFrame = JSON.parse(jsonString)
//                     frames.push(result)
//                     currentFrameNumberState.setValue(frames.length - 1)
//                 }
//                 catch(err) {
//                     console.log(err)
//                 }
//                 jsonString = ""
//             }
//         }
//     }

//     //close device
//     serialWriterState.setValue(undefined)
//     reader.cancel()
//     await readableStreamClosed.catch(() => { /* Ignore the error */ })
//     writer.releaseLock()
//     await device.close()

//     //delete data
//     currentFrameNumberState.setValue(-1)
//     frames.length = 0
// }