import "./Graph.scss"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineSeriesPoint } from 'react-vis'
//import { getAcceleration, getCanSatPosition, getPressure, getTemperature, getTime, getVelocity, SimMetaData, StationMetaData } from "../flightProperties"
import { useGlobalState } from "../globalState"
import { currentFrameNumberState, flightDataState } from ".."
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"
import { SimData, StationData } from "../flightProperties"

export const Properties = [
    "Position x",
    "Position y",
    "Position z",
    "Velocity x",
    "Velocity y",
    "Velocity z",
    "Acceleration x",
    "Acceleration y",
    "Acceleration z",
    "Pressure",
    "Temperature",
    "Time"
] as const

export type Property = typeof Properties[number]

interface props {
    removeUtility: () => void
    bigWindow: boolean
}

const margin = 50
const emptyData: LineSeriesPoint[] = [{x: 0, y: 0}]

export const Graph:FC<props> = ({removeUtility, bigWindow}) => {
    const [flightMetaData] = useGlobalState(flightDataState)
    const [currentFrameNumber] = useGlobalState(currentFrameNumberState)
    const [axisXProperty, setAxisXProperty] = useState<Property>("Time")
    const [axisYProperty, setAxisYProperty] = useState<Property>("Velocity y")
    const [plotSize, setPlotSize] = useState({width: 0, height: 0})
    const GraphDiv = useRef<HTMLDivElement | null>(null)
    const data = useRef<LineSeriesPoint[]>([{x: 0, y: 0}])    
    
    const resizeGraph = useCallback(() => {
        if(GraphDiv.current === null) return
        const {width, height} = GraphDiv.current.getBoundingClientRect()
        setPlotSize({width: width - margin, height: height - margin})
    }, [setPlotSize, removeUtility])
    
    useEffect(() => {
        resizeGraph()
        window.addEventListener("resize", resizeGraph)
        return () => window.removeEventListener("resize", resizeGraph)
    }, [])

    useEffect(() => {
        data.current = []
    }, [axisXProperty, axisYProperty])

    useEffect(() => {
        if(currentFrameNumber === undefined || currentFrameNumber === -1) {
            data.current = []
        }
        else {        
            for(let i = data.current.length; i <= currentFrameNumber; i++) {
                data.current.push({
                    x: pickProperties(flightMetaData, axisXProperty, i),
                    y: pickProperties(flightMetaData, axisYProperty, i)
                })
            }
        }
    }, [currentFrameNumber])

    const settingsOptions: SettingsOption[] = useMemo(() => [
        {
            title: "Remove window",
            action: removeUtility        
        },
        {
            title: "Open in new window",
            action: () => {
                const newWindow = window.open("./", "_blank")
                if(newWindow) {
                    newWindow.defaultUtilities = ["Graph"]
                }
                removeUtility()
            }
        }, 
        {
            title: "Axis x property",
            subOptions: Properties.map((propertyName): SettingsOption => ({
                title: propertyName,
                action: () => setAxisXProperty(propertyName)
            }))
        },
        {
            title: "Axis y property",
            subOptions: Properties.map((propertyName): SettingsOption => ({
                title: propertyName,
                action: () => setAxisYProperty(propertyName)
            }))
        }
    ], [])
        
    const {width, height} = plotSize
    return(
        <UtilityWindow className="Graph" settingsOptions={settingsOptions} bigWindow={bigWindow}>
            <span className="axisName Y"> { axisYProperty } </span>
            <span className="axisName X"> { axisXProperty } </span>
            <div ref={GraphDiv} onClick={resizeGraph}>
                <XYPlot width={width} height={height} stroke="#fab132" >
                    <HorizontalGridLines />                
                    <LineSeries data={(data.current.length === 0)? emptyData : data.current} />
                    <XAxis />
                    <YAxis />
                </XYPlot>            
            </div>            
        </UtilityWindow>
    )
}


function pickProperties(data: SimData | StationData, p: Property, i: number): number {
    switch(p) {
        case "Position x":
            return data.getPosition(i).x
        case "Position y":
            return data.getPosition(i).y
        case "Position z":
            return data.getPosition(i).z
        case "Velocity x":
            return data.getVelocity(i).x
        case "Velocity y":
            return data.getVelocity(i).y
        case "Velocity z":
            return data.getVelocity(i).z
        case "Acceleration x":
            return data.getAcceleration(i).x
        case "Acceleration y":
            return data.getAcceleration(i).y
        case "Acceleration z":
            return data.getAcceleration(i).z
        case "Pressure":
            return data.getPressure(i)
        case "Temperature":
            return data.getTemperature(i)
        case "Time":
            return data.getTime(i)
        default:
            return 0
    }        
}