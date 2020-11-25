import "./Graph.scss"
import React, { useEffect, useRef, useState } from 'react'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineSeriesPoint, VerticalGridLines} from 'react-vis'
import { getAcceleration, getCanSatPosition, getPressure, getTemperature, getTime, getVelocity, SimMetaData, StationMetaData } from "../flightProperties"
import { useGlobalState } from ".."
import { Paper } from "@material-ui/core"

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
    const [flightMetaData] = useGlobalState("flightMetaData")
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
                    x: pickProperties(flightMetaData, axisXProperty, i),
                    y: pickProperties(flightMetaData, axisYProperty, i)
                })
            }
        }
    }, [currentFrameNumber])
    

    const {width, height} = plotSize
    return(
        <Paper className="Graph" ref={GraphDiv} color="red">
            <XYPlot width={width} height={height} stroke="#fab132" >
                <HorizontalGridLines />
                <VerticalGridLines />
                <LineSeries data={data.current} />
                <XAxis />
                <YAxis />
            </XYPlot>            
        </Paper>
    )
}


function pickProperties(data: StationMetaData | SimMetaData, p: Property, i: number): number {
    switch(p) {
        case "Position x":
            return getCanSatPosition(i).x
        case "Position y":
            return getCanSatPosition(i).y
        case "Position z":
            return getCanSatPosition(i).z
        case "Velocity x":
            return getVelocity(i).x
        case "Velocity y":
            return getVelocity(i).y
        case "Velocity z":
            return getVelocity(i).z
        case "Acceleration x":
            return getAcceleration(i).x
        case "Acceleration y":
            return getAcceleration(i).y
        case "Acceleration z":
            return getAcceleration(i).z
        case "Pressure":
            return getPressure(i)
        case "Temperature":
            return getTemperature(i)
        case "Time":
            return getTime(data, i)
        default:
            return 0
    }        
}