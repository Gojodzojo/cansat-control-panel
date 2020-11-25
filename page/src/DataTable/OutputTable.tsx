import { TableBody, TableCell, TableRow } from "@material-ui/core"
import React from "react"
import { useGlobalState } from ".."
import { getVelocity, getCanSatPosition, getAcceleration, getTime, getLongitude, getLatitude, getAzimuth, getTemperature, getPressure } from "../flightProperties"
import { TableEntry } from "./DataTable"

export const OutputTable = () => {
    const [flightProperties] = useGlobalState("flightProperties")
    const [currentFrameNumber] = useGlobalState("currentFrameNumber")

    let data: TableEntry[] = []
    if(currentFrameNumber === undefined || currentFrameNumber === -1) {
        data = []
    }
    else {
        const position = getCanSatPosition(flightProperties, currentFrameNumber)
        const velocity = getVelocity(flightProperties, currentFrameNumber)
        const acceleration = getAcceleration(flightProperties, currentFrameNumber)        

        data = [
            {
                rowName: "Time",
                value: getTime(flightProperties, currentFrameNumber).toFixed(1),
                unit: "s"
            },            
            {
                rowName: "Longitude",
                value: getLongitude(flightProperties, currentFrameNumber).toFixed(5),
                unit: "°"
            },
            {
                rowName: "Latitude",
                value: getLatitude(flightProperties, currentFrameNumber).toFixed(5),
                unit: "°"
            },
            {
                rowName: "Azimuth",
                value: getAzimuth(flightProperties, currentFrameNumber),
                unit: "°"
            },
            {
                rowName: "Temperature",
                value: getTemperature(flightProperties, currentFrameNumber).toFixed(1),
                unit: "°C"
            },
            {
                rowName: "Pressure",
                value: getPressure(flightProperties, currentFrameNumber).toFixed(1),
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
        <TableBody className="DataTable">
            {
                data.map(({rowName, value, unit}) => (
                    <TableRow key={rowName}>
                        <TableCell align="left">{rowName}</TableCell>
                        <TableCell align="right">{value}</TableCell>
                        {unit && <TableCell align="left">{unit}</TableCell>}
                    </TableRow>
                ))
            }
        </TableBody>
    )
}