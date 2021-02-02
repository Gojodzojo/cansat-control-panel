import { DataFrame } from "./flightProperties"

function newJsonDecoder(){
    return new TransformStream<string, any>({
        start(controller: any) {
            controller.buf = ''
            controller.pos = 0
        },
        transform(chunk: any, controller: any) {
            console.log(chunk) 
        }
    })
}

function makeWriteableEventStream(eventTarget: EventTarget) {
    return new WritableStream({
        start(controller: any) {
            eventTarget.dispatchEvent(new Event('start'))
        },
        write(dataFrame: DataFrame, controller: any) {
            eventTarget.dispatchEvent( new MessageEvent("data", { data: dataFrame }) )
        },
        close() {
            eventTarget.dispatchEvent(new CloseEvent('close'))
        },
        abort(reason: string) {
            eventTarget.dispatchEvent(new CloseEvent('abort', { reason }))
        }
    })
}

export let stopStation = async () => console.error("Error in watchForStationData.ts")
export let sendStationMessage = async (messageBytes: Uint8Array) => console.error("Error in watchForStationData.ts")

export async function startStation(device: any) {
    const eventTarget = new EventTarget()
    const writableEventStream = makeWriteableEventStream(eventTarget)
    const controller = new AbortController()
    
    await device.open({ baudRate: 115200 })
    const writer = (device.writable as WritableStream<Uint8Array>).getWriter()
    const readableStreamClosed = (device.readable as ReadableStream)
        .pipeThrough(new TextDecoderStream())
        .pipeThrough<DataFrame>(newJsonDecoder())
        .pipeTo(writableEventStream, {preventAbort: false, preventCancel: false, preventClose: false, signal: controller.signal})

    stopStation = async () => {
        controller.abort()
        await readableStreamClosed.catch(() => { /* Ignore the error */ })
        writer.releaseLock()      
        console.log(device.writable.locked)  
        console.log(device.readable.locked)  
        await device.close()
    }

    sendStationMessage = async (messageBytes: Uint8Array) => {
        await writer.write(messageBytes)
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