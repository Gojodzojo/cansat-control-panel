import { DataFrame } from "./flightProperties"

interface SimulationExports {
    startSimulation: (newCanSatMass: number, newAirCS: number, windSpeed: number, windAzimuth: number, canSatSurfaceArea: number, initialHeight: number, frameRate: number) => void
    stopSimulation: () => void    
    doPhysics: () => void
}

let dataFrame: DataFrame | null = null

const options = {
    env: {
        Log: (n: number) => console.log(n),
        sendDataFrame: (
            azimuth: number,
            pressure: number,
            temperature: number,
            latitude: number,
            longitude: number,
            time: number,
            height: number,
            rssi: number,
            message: number,
        ) => dataFrame = {
            azimuth,
            pressure,
            temperature,
            latitude,
            longitude,
            time,
            height,
            rssi,
            message
        }
    }
}

let simulationExports: SimulationExports
(async () => {
    const instantiatedSource = await WebAssembly.instantiateStreaming(fetch("./wasm/simulation.wasm"), options)
    simulationExports = instantiatedSource.instance.exports as any as SimulationExports
    console.log("Wasm loaded")
})()

/**
 * Set simulation parameters and start simulation loop
 */
export function startSimulation(newCanSatMass: number, newAirCS: number, windSpeed: number, windAzimuth: number, canSatSurfaceArea: number, initialHeight: number, frameRate: number) {
    simulationExports.startSimulation(newCanSatMass, newAirCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate)
}

/**
 * Stop simulation loop
 */
export function stopSimulation() {
    simulationExports.stopSimulation()
}

/**
 * Wait untill simulation sends DataFrame
 */
export async function receiveData() {      
    try {
        while(true) {
            if(dataFrame !== null) {
                return dataFrame
            }
        }        
    }
    finally {
        dataFrame = null
    }
}