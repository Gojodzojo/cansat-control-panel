import { TableBody, TableCell, TableRow } from "@material-ui/core"
import React from "react"
import { currentFrameNumberState, flightDataState } from "../index"
import { useGlobalState } from "../globalState"
import { TableEntry } from "./DataTable"

export const OutputTable = () => {
    const [flightData] = useGlobalState(flightDataState)
    const [currentFrameNumber] = useGlobalState(currentFrameNumberState)

    let data: TableEntry[] = []
    if(currentFrameNumber === -1) {
        data = []
    }
    else {
        const position = flightData.getPosition(currentFrameNumber)
        const velocity = flightData.getVelocity(currentFrameNumber)
        const acceleration = flightData.getAcceleration(currentFrameNumber)        

        data = [
            {
                rowName: "Time",
                value: flightData.getTime(currentFrameNumber).toFixed(1),
                unit: "s"
            },            
            {
                rowName: "Longitude",
                value: flightData.getLongitude(currentFrameNumber).toFixed(5),
                unit: "°"
            },
            {
                rowName: "Latitude",
                value: flightData.getLatitude(currentFrameNumber).toFixed(5),
                unit: "°"
            },
            {
                rowName: "Heading",
                value: flightData.getHeading(currentFrameNumber),
                unit: "°"
            },
            {
                rowName: "Temperature",
                value: flightData.getTemperature(currentFrameNumber).toFixed(1),
                unit: "°C"
            },
            {
                rowName: "Pressure",
                value: flightData.getPressure(currentFrameNumber).toFixed(1),
                unit: "hPa"
            },
            {
                rowName: "Position x",
                value: position.x.toFixed(2),
                unit: "m"
            },
            {
                rowName: "Position y",
                value: position.y.toFixed(2),
                unit: "m"
            },
            {
                rowName: "Position z",
                value: position.z.toFixed(2),
                unit: "m"
            },            
            {
                rowName: "Velocity x",
                value: velocity.x.toFixed(2),
                unit: "m/s"
            },
            {
                rowName: "Velocity y",
                value: velocity.y.toFixed(2),
                unit: "m/s"
            },
            {
                rowName: "Velocity z",
                value: velocity.z.toFixed(2),
                unit: "m/s"
            },
            {
                rowName: "Acceleration x",
                value: acceleration.x.toFixed(2),
                unit: <>m/s<sup>2</sup></>
            },
            {
                rowName: "Acceleration y",
                value: acceleration.y.toFixed(2),
                unit: <>m/s<sup>2</sup></>
            },
            {
                rowName: "Acceleration z",
                value: acceleration.z.toFixed(2),
                unit: <>m/s<sup>2</sup></>
            }                     
        ]
    }
    
    return(
        <TableBody>
            {
                data.map(({rowName, value, unit}) => (
                    <TableRow key={rowName}>
                        <TableCell align="left">{rowName}</TableCell>
                        <TableCell align="right"> {value} {unit && unit} </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    )
}