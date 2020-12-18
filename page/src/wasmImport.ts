import { SimFrame } from "./flightProperties";

interface SimulationExports {
    setVariables: (newCanSatMass: number, newAirCS: number, windSpeed: number, windAzimuth: number, canSatSurfaceArea: number, initialHeight: number, frameRate: number) => void,
    doPhysics: () => void
}

let simFlightProperties: SimFrame = {
    position: {x: 0, y: 0, z: 0},
    velocity: {x: 0, y: 0, z: 0},
    acceleration: {x: 0, y: 0, z: 0},
    azimuth: 0
}

const options = {
    env: {
        Log: (n: number) => console.log(n),
        setFlightProperties: (
            positionX: number, positionY: number, positionZ: number,
            velocityX: number, velocityY: number, velocityZ: number,
            accelerationX: number, accelerationY: number, accelerationZ: number
        ) => simFlightProperties =  {
            position: {x: positionX, y: positionY, z: positionZ},
            velocity: {x: velocityX, y: velocityY, z: velocityZ},
            acceleration: {x: accelerationX, y: accelerationY, z: accelerationZ},
            azimuth: 0
        }
    }
};
let simulationExports: SimulationExports
(async () => {
    const instantiatedSource = await WebAssembly.instantiateStreaming(fetch("./wasm/simulation.wasm"), options)
    simulationExports = instantiatedSource.instance.exports as any as SimulationExports
    console.log("Wasm loaded")
})()

export function setVariables(newCanSatMass: number, newAirCS: number, windSpeed: number, windAzimuth: number, canSatSurfaceArea: number, initialHeight: number, frameRate: number) {
    simulationExports.setVariables(newCanSatMass, newAirCS, windSpeed, windAzimuth, canSatSurfaceArea, initialHeight, frameRate)
}

export function doPhysics() {
    simulationExports.doPhysics()
    return simFlightProperties
}