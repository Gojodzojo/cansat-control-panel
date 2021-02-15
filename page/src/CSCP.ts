import { MessageFrame } from "./flightProperties";
import { currentAppModeState, currentFrameNumberState, flightDataState, isPausedState, isRunningState } from "./index";
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
    flightDataState.setValue({frames: [], messageFrames: []})
}

export async function sendMessage(messageFrame: MessageFrame) {
    if(currentAppModeState.getValue() === "Station") {
        sendStationMessage(messageFrame)
    }
    else {
        sendSimulatorMessage(messageFrame)
    }
}