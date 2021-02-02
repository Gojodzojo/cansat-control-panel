import { currentAppModeState, currentFrameNumberState, flightDataState, isPausedState, isRunningState } from ".";
import { sendSimulatorMessage, startSimulator, stopSimulation } from "./watchForSimulatorData";
import { sendStationMessage, startStation, stopStation } from "./watchForStationData";

/**
 * Starts simulation in simulation mode
 */
export async function start(): Promise<void>;

/**
 * Starts simulation in ground station mode
 * @param device Serial USB device
 */
export async function start(device: any): Promise<void>;

export async function start(device?: any) {
    isPausedState.setValue(false)
    currentFrameNumberState.setValue(-1)
    isRunningState.setValue(true)    

    if(device !== undefined && currentAppModeState.getValue() === "Station") {
        await startStation(device)
    }
    else {
        startSimulator()
    }
}

export async function stop() {
    if(currentAppModeState.getValue() === "Station") {
        await stopStation()
    }
    else {
        stopSimulation()
    }

    isRunningState.setValue(false)
    currentFrameNumberState.setValue(-1)
    flightDataState.setValue({frames: []})
}

export async function sendMessage(messageBytes: Uint8Array) {
    if(currentAppModeState.getValue() === "Station") {
        sendStationMessage(messageBytes)
    }
    else {
        sendSimulatorMessage(messageBytes)
    }
}