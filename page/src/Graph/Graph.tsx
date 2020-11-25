import "./Graph.scss"
import React, { useEffect, useRef, useState } from 'react'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineSeriesPoint, VerticalGridLines} from 'react-vis'
import { getAcceleration, getCanSatPosition, getPressure, getTemperature, getTime, getVelocity, SimFlightData, StationFlightData } from "../flightProperties"
import { useGlobalState } from ".."

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

export const Graph = () => {
    const [flightProperties] = useGlobalState("flightProperties")
    const [currentFrameNumber] = useGlobalState("currentFrameNumber")
    const [axisXProperty, setAxisXProperty] = useState<Property>("Time")
    const [axisYProperty, setAxisYProperty] = useState<Property>("Velocity y")
    const [plotSize, setPlotSize] = useState({width: 0, height: 0})
    const GraphDiv = useRef<HTMLDivElement | null>(null)
    const data = useRef<LineSeriesPoint[]>([])
    
    const resizeGraph = () => {
        if(GraphDiv.current === null) return
        const {width, height} = GraphDiv.current.getBoundingClientRect()
        setPlotSize({width, height})
    }
    
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
            data.current = [{x: 0, y: 0}]
        }
        else {        
            for(let i = data.current.length; i <= currentFrameNumber; i++) {
                data.current.push({
                    x: pickProperties(flightProperties, axisXProperty, i),
                    y: pickProperties(flightProperties, axisYProperty, i)
                })
            }
        }
    }, [currentFrameNumber])
    

    const {width, height} = plotSize
    return(
        <div className="Graph" ref={GraphDiv}>
            <XYPlot width={width} height={height} stroke="#fab132" >
                <HorizontalGridLines />
                <VerticalGridLines />
                <LineSeries data={data.current} />
                <XAxis />
                <YAxis />
            </XYPlot>            
        </div>
    )
}


function pickProperties(data: SimFlightData | StationFlightData, p: Property, i: number): number {
    switch(p) {
        case "Position x":
            return getCanSatPosition(data, i).x
        case "Position y":
            return getCanSatPosition(data, i).y
        case "Position z":
            return getCanSatPosition(data, i).z
        case "Velocity x":
            return getVelocity(data, i).x
        case "Velocity y":
            return getVelocity(data, i).y
        case "Velocity z":
            return getVelocity(data, i).z
        case "Acceleration x":
            return getAcceleration(data, i).x
        case "Acceleration y":
            return getAcceleration(data, i).y
        case "Acceleration z":
            return getAcceleration(data, i).z
        case "Pressure":
            return getPressure(data, i)
        case "Temperature":
            return getTemperature(data, i)
        case "Time":
            return getTime(data, i)
        default:
            return 0
    }        
}