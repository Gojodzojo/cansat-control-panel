import "./index.scss"
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App/App'
import { GlobalState } from './globalState'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { FlightData, SimMetaData } from "./flightProperties"

export const AppModes = ["Simulator", "Station", "Player"] as const
export type AppMode = typeof AppModes[number]

export const Utilities = [
  "Visualizer",
  "Graph",
  "Data table",
  "Message sender"
] as const
export type Utility = typeof Utilities[number]

declare global {
  interface Window {
    sharedState: {
      currentAppModeState: GlobalState<AppMode>
      flightDataState: GlobalState<FlightData>
      isRunningState: GlobalState<boolean>
      currentFrameNumberState: GlobalState<number>
      isPausedState: GlobalState<boolean>
      simMetaDataState: GlobalState<SimMetaData>
    }    
    defaultUtilities: Utility[]
  }
}

if(window.opener === null) {  
  window.sharedState = {
    currentAppModeState: new GlobalState<AppMode>("Simulator"),
    isRunningState: new GlobalState<boolean>(false),
    currentFrameNumberState: new GlobalState<number>(-1),
    isPausedState: new GlobalState<boolean>(false),
    flightDataState: new GlobalState<FlightData>(new FlightData()),
    simMetaDataState: new GlobalState<SimMetaData>(new SimMetaData())
  }
  window.defaultUtilities = ["Visualizer", "Data table", "Graph", "Message sender"]
}
else {  
  window.sharedState = (window.opener as Window).sharedState
} 

export const {currentAppModeState, isRunningState, currentFrameNumberState, isPausedState, flightDataState, simMetaDataState} = window.sharedState


ReactDOM.render(
  <React.StrictMode>
    <App defautlUtilities={window.defaultUtilities}/>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.register();