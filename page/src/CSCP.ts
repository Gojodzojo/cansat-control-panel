import { MessageFrame } from "./flightProperties";
import { currentAppModeState, isRunningState } from "./index";
import { startPlayer, stopPlayer } from "./playFromFile";
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
    isRunningState.setValue(true)

    if(device !== undefined && currentAppModeState.getValue() === "Station") {
        await startStation(device)
    }
    else if(currentAppModeState.getValue() === "Player") {
        startPlayer()
    }
    else {
        startSimulator()
    }
}

export async function stop() {
    if(currentAppModeState.getValue() === "Station") {
        await stopStation()
    }
    else if(currentAppModeState.getValue() === "Player") {
        stopPlayer()
    }
    else {
        stopSimulation()
    }
    isRunningState.setValue(false)
}

export async function sendMessage(messageFrame: MessageFrame) {
    if(currentAppModeState.getValue() === "Station") {
        sendStationMessage(messageFrame)
    }
    else {
        sendSimulatorMessage(messageFrame)
    }
}