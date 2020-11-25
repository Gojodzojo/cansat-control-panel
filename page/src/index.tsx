import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App/App'
import { SimMetaData, StationMetaData, SimProperties, StationProperties, DefaultSimMetaData } from './flightProperties'
import { createGlobalState } from 'react-hooks-global-state'
import { ExportFields } from 'react-hooks-global-state/dist/src/createGlobalState'

export const AppModes = ["Simulator", "Station", "Player"] as const
export type AppMode = typeof AppModes[number]

interface GlobalStateProperties {
  currentAppMode: AppMode
  flightMetaData: SimMetaData | StationMetaData
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
    flightProperties: SimProperties[] | StationProperties[]
  }
}

if(window.opener === null) {
  window.globalState = createGlobalState<GlobalStateProperties>({
    currentAppMode: "Simulator",
    isRunning: false,
    currentFrameNumber: undefined,
    isPaused: false,
    flightMetaData: DefaultSimMetaData
  })
  window.flightProperties = []
  //window.open("./", "_blank")
}
else {
  const {globalState, flightProperties} = (window.opener as Window)
  window.globalState = globalState
  window.flightProperties = flightProperties
} 

export const {getGlobalState, setGlobalState, useGlobalState, useGlobalStateProvider} = window.globalState
export const {flightProperties} = window

ReactDOM.render(
  <React.StrictMode> <App /> </React.StrictMode>,
  document.getElementById('root')
)