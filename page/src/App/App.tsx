import React, { createContext, useReducer, useState } from 'react'
import "./App.scss"
import UnityVisualiser from '../UnityVisualizer/UnityVisualiser'
import { Vector } from '../usefullStuff'
import MainComponent, { AppModes } from '../MainComponent/MainComponent'
import Graph from '../Graph/Graph'


interface ContextType {
  isPaused: boolean,
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>,
  originalHeight: number,
  setOriginalHeight: React.Dispatch<React.SetStateAction<number>>,
  automaticLocalisation: boolean,
  setAutomaticLocalisation: React.Dispatch<React.SetStateAction<boolean>>,
  automaticWind: boolean,
  setAutomaticWind: React.Dispatch<React.SetStateAction<boolean>>,
  automaticPressure: boolean,
  setAutomaticPressure: React.Dispatch<React.SetStateAction<boolean>>,
  originalLongitude: number,
  setOriginalLongitude: React.Dispatch<React.SetStateAction<number>>,
  originalLatitude: number,
  setOriginalLatitude: React.Dispatch<React.SetStateAction<number>>,
  windSpeed: number,
  setWindSpeed: React.Dispatch<React.SetStateAction<number>>,
  windAzimuth: number,
  setWindAzimuth: React.Dispatch<React.SetStateAction<number>>,
  canSatMass: number,
  setCanSatMass: React.Dispatch<React.SetStateAction<number>>,
  airCS: number, 
  setAirCS: React.Dispatch<React.SetStateAction<number>>,
  canSatSurfaceArea: number,
  setCanSatSurfaceArea: React.Dispatch<React.SetStateAction<number>>,
  flightProperties: FlightProperties[],
  setFlightProperties: React.Dispatch<FlightProperties | ReducerActions>,
  appMode: AppModes,
  setAppMode: React.Dispatch<React.SetStateAction<AppModes>>
}

export interface FlightProperties {
  canSatPosition: Vector
  velocity: Vector,
  pressure: number,
  time: number
}

export enum ReducerActions {
  reset = "RESET"
}

export const context = createContext<ContextType>(undefined)

export default () => {
  const [originalHeight, setOriginalHeight] = useState(1000)  
  const [isPaused, setIsPaused] = useState(false)
  const [automaticLocalisation, setAutomaticLocalisation] = useState(true)
  const [originalLongitude, setOriginalLongitude] = useState(0)
  const [originalLatitude, setOriginalLatitude] = useState(0)
  const [automaticWind, setAutomaticWind] = useState(true)
  const [automaticPressure, setAutomaticPressure] = useState(true)  
  const [windSpeed, setWindSpeed] = useState(0)
  const [windAzimuth, setWindAzimuth] = useState(0)  
  const [canSatMass, setCanSatMass] = useState(0.3)
  const [airCS, setAirCS] = useState(0.3)
  const [canSatSurfaceArea, setCanSatSurfaceArea] = useState(0.00759)
  const [appMode, setAppMode] = useState(AppModes.SetData)

  const reducer = function<T>() {    
    return (state: T[], action: T | ReducerActions) => {
      if( action === ReducerActions.reset ) {
        return []        
      }
      return [...state, action]
    }
  }

  const [flightProperties, setFlightProperties] = useReducer(reducer<FlightProperties>(), [])


  const contextValues: ContextType = {
    isPaused,
    setIsPaused,
    originalHeight,
    setOriginalHeight,
    automaticLocalisation,
    setAutomaticLocalisation,
    automaticWind,
    setAutomaticWind,
    automaticPressure,
    setAutomaticPressure,
    originalLongitude,
    setOriginalLongitude,
    originalLatitude,
    setOriginalLatitude,
    windSpeed,
    setWindSpeed,
    windAzimuth,
    setWindAzimuth,
    canSatMass,
    setCanSatMass,
    airCS, 
    setAirCS,
    canSatSurfaceArea,
    setCanSatSurfaceArea,
    flightProperties,
    setFlightProperties,
    appMode,
    setAppMode
  }
  const anyWindow = window as any
  anyWindow.contextValues = contextValues  
  
  return (
    <div className="App">      
      <context.Provider value={contextValues}>              
        <UnityVisualiser />
        <Graph />
        <MainComponent />                
      </context.Provider>      
    </div>
  )
}
