import React, { createContext, useEffect, useReducer, useState } from 'react'
import "./App.scss"
import UnityVisualiser from '../UnityVisualizer/UnityVisualiser'
import { getPosition, Vector } from '../usefullStuff'
import MainComponent, { Modes } from '../MainComponent/MainComponent'


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
  canSatPosition: Vector[],
  setCanSatPosition: React.Dispatch<Vector | ReducerActions>,
  velocity: Vector[],
  setVelocity: React.Dispatch<Vector | ReducerActions>,
  originalLongitude: number,
  setOriginalLongitude: React.Dispatch<React.SetStateAction<number>>,
  originalLatitude: number,
  setOriginalLatitude: React.Dispatch<React.SetStateAction<number>>,
  windSpeed: number,
  setWindSpeed: React.Dispatch<React.SetStateAction<number>>,
  windAzimuth: number,
  setWindAzimuth: React.Dispatch<React.SetStateAction<number>>,
  pressure: number[],
  setPressure: React.Dispatch<number | ReducerActions>,
  time: number[],
  setTime: React.Dispatch<number | ReducerActions>,
  canSatMass: number,
  setCanSatMass: React.Dispatch<React.SetStateAction<number>>,
  airCS: number, 
  setAirCS: React.Dispatch<React.SetStateAction<number>>,
  canSatSurfaceArea: number,
  setCanSatSurfaceArea: React.Dispatch<React.SetStateAction<number>>
}


export enum ReducerActions {
  clear = "CLEAR"
}

function isReducerAction(action: any): action is ReducerActions {
  return action === ReducerActions
}

export const context = createContext<ContextType>(undefined)

export default () => {
  useEffect(() => {
    if(!setAutomaticLocalisation) return
    getPosition()
      .then(position => {
        const {latitude, longitude} = position.coords
        setOriginalLatitude(latitude)
        setOriginalLongitude(longitude)
      })
      .catch(error => console.log(error))
  }, [])



  const reducer = function<T>() {    
    return (state: T[], action: T | ReducerActions) => {
      if( !isReducerAction(action) ) {
        return [...state, action]
      }
      return []
    }
  }

  const [originalHeight, setOriginalHeight] = useState(1000)
  const [canSatPosition, setCanSatPosition] = useReducer(reducer<Vector>(), [{x: 0, y: originalHeight, z: 0}])
  const [velocity, setVelocity] = useReducer(reducer<Vector>(), [{x: 0, y: 0, z: 0}])
  const [pressure, setPressure] = useReducer(reducer<number>(), [0])
  const [time, setTime] = useReducer(reducer<number>(), [0])  
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
    canSatPosition,
    setCanSatPosition,
    velocity,
    setVelocity,
    originalLongitude,
    setOriginalLongitude,
    originalLatitude,
    setOriginalLatitude,
    windSpeed,
    setWindSpeed,
    windAzimuth,
    setWindAzimuth,
    pressure,
    setPressure,
    time,
    setTime,
    canSatMass,
    setCanSatMass,
    airCS, 
    setAirCS,
    canSatSurfaceArea,
    setCanSatSurfaceArea
  }
  const anyWindow = window as any
  anyWindow.contextValues = contextValues  
  
  return (
    <div className="App">      
      <context.Provider value={contextValues}>              
        <UnityVisualiser />
        
        <MainComponent />          
      </context.Provider>      
    </div>
  )
}
