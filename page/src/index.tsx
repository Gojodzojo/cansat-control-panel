import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App/App'
import { DefaultSimFlightData, SimFlightData, StationFlightData } from './flightProperties'
import { createGlobalState } from 'react-hooks-global-state'
import { ExportFields } from 'react-hooks-global-state/dist/src/createGlobalState'

export const AppModes = ["Simulator", "Station", "Player"] as const
export type AppMode = typeof AppModes[number]



interface GlobalStateProperties {
  currentAppMode: AppMode
  flightProperties: SimFlightData | StationFlightData
  isRunning: boolean
  currentFrameNumber: number | undefined
  isPaused: boolean
}

interface GlobalState {
  useGlobalStateProvider: () => void;
  useGlobalState: <StateKey extends keyof GlobalStateProperties>(stateKey: StateKey) => readonly [GlobalStateProperties[StateKey], (u: import("react").SetStateAction<GlobalStateProperties[StateKey]>) => void];
  getGlobalState: <StateKey_1 extends keyof GlobalStateProperties>(stateKey: StateKey_1) => GlobalStateProperties[StateKey_1];
  setGlobalState: <StateKey_2 extends keyof GlobalStateProperties>(stateKey: StateKey_2, update: import("react").SetStateAction<GlobalStateProperties[StateKey_2]>) => void;
  getState: () => GlobalStateProperties;
  setState: (nextGlobalState: GlobalStateProperties) => void;
  dispatch: (action: never) => never;
}

declare global {
  interface Window {
    globalState: Pick<GlobalState, ExportFields>
  }
}

if(window.opener === null) {
  window.globalState = createGlobalState<GlobalStateProperties>({
    currentAppMode: "Simulator",
    flightProperties: DefaultSimFlightData,
    isRunning: false,
    currentFrameNumber: undefined,
    isPaused: false
  })
  //window.open("./", "_blank")
}
else {
  const {globalState} = (window.opener as Window)
  window.globalState = globalState
} 

export const {getGlobalState, setGlobalState, useGlobalState, useGlobalStateProvider} = window.globalState

ReactDOM.render(
  <React.StrictMode> <App /> </React.StrictMode>,
  document.getElementById('root')
)