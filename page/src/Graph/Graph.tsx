import "./Graph.scss"
import React, { useContext, useEffect, useRef, useState } from 'react'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineSeriesPoint, VerticalGridLines} from 'react-vis'
import { context, FlightProperties } from '../App/App'

enum Properties {
    canSatPositionX = "Position x",
    canSatPositionY = "Position y",
    canSatPositionZ = "Position z",
    velocityX = "Velocity x",
    velocityY = "Velocity y",
    velocityZ = "Velocity z",
    pressure = "Preassure",
    time = "Time"
}

const pickProperties = (ch: FlightProperties, p: Properties): number => {
    switch(p) {
        case Properties.canSatPositionX:
            return ch.canSatPosition.x
        case Properties.canSatPositionY:
            return ch.canSatPosition.y
        case Properties.canSatPositionZ:
            return ch.canSatPosition.z
        case Properties.velocityX:
            return ch.velocity.x
        case Properties.velocityY:
            return ch.velocity.y * -1
        case Properties.velocityZ:
            return ch.velocity.z
        case Properties.pressure:
            return ch.pressure
        case Properties.time:
            return ch.time
        default:
            return 0
    }        
}

interface SelectProps {
    onChange: React.Dispatch<React.SetStateAction<Properties>>,
    value: Properties
}

const SelectProperty:React.FC<SelectProps> = ({onChange, value}) => (
    <select onChange={e => onChange(e.target.value as Properties)} value={value}>
    {
        Object.keys(Properties).map((propName, index) => {
            const propVal: string = Properties[propName]
            return <option key={index} value={propVal}> {propVal} </option>
        })
    }
    </select>
)

export default () => {
    const {flightProperties} = useContext(context)
    const [plotSize, setPlotSize] = useState({width: 0, height: 0})
    const GraphDiv = useRef<HTMLDivElement>()

    const resizeGraph = () => {
        if(GraphDiv.current === undefined) return
        const {width, height} = GraphDiv.current.getBoundingClientRect()
        setPlotSize({width, height})
    }
    
    useEffect(() => {
        resizeGraph()
        window.addEventListener("resize", resizeGraph)
        return () => window.removeEventListener("resize", resizeGraph)
    }, [])

    const [axisXProperty, setAxisXProperty] = useState(Properties.time)
    const [axisYProperty, setAxisYProperty] = useState(Properties.velocityY)

    const data: LineSeriesPoint[] = flightProperties.length === 0? 
        [{x: 0, y: 0}]
        :
        flightProperties.map((chunk) => {
        return {
            x: pickProperties(chunk, axisXProperty),
            y: pickProperties(chunk, axisYProperty),
        }
    })

    const {width, height} = plotSize
    return(
        <div className="Graph" ref={GraphDiv}>
            <XYPlot width={width} height={height} stroke="#fab132" >
                <HorizontalGridLines />
                <VerticalGridLines />
                <LineSeries data={data} />
                <XAxis />
                <YAxis />
            </XYPlot>
            Axis x:
            <SelectProperty value={axisXProperty} onChange={setAxisXProperty} />
            <br />
            Axis y:            
            <SelectProperty value={axisYProperty} onChange={setAxisYProperty} />
        </div>
    )
}