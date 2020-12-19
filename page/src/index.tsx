import "./index.scss"
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App/App'
import { SimData, StationData } from './flightProperties'
import { GlobalState } from './globalState'
//import { AdditionalApp } from "./AdditionalApp/AdditionalApp"

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
      flightDataState: GlobalState<SimData | StationData>
      isRunningState: GlobalState<boolean>
      currentFrameNumberState: GlobalState<number | undefined>
      isPausedState: GlobalState<boolean>
      serialWriterState: GlobalState<WritableStreamDefaultWriter | undefined>
    }    
    defaultUtilities: Utility[]
  }
}

if(window.opener === null) {  
  window.sharedState = {
    currentAppModeState: new GlobalState<AppMode>("Simulator"),
    isRunningState: new GlobalState<boolean>(false),
    currentFrameNumberState: new GlobalState<number | undefined>(undefined),
    isPausedState: new GlobalState<boolean>(false),
    flightDataState: new GlobalState<SimData | StationData>(new SimData()),
    serialWriterState: new GlobalState<WritableStreamDefaultWriter | undefined>(undefined)
  }
  window.defaultUtilities = ["Visualizer", "Data table", "Graph", "Message sender"]
}
else {  
  window.sharedState = (window.opener as Window).sharedState
} 

export const {currentAppModeState, isRunningState, currentFrameNumberState, isPausedState, flightDataState, serialWriterState} = window.sharedState


ReactDOM.render(
  <React.StrictMode>
    <App defautlUtilities={window.defaultUtilities}/>
  </React.StrictMode>,
  document.getElementById('root')
)
