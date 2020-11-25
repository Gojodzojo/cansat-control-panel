import { Switch, TableBody, TableCell, TableRow, TextField } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useGlobalState } from ".."
import { SimMetaData } from "../flightProperties"
import { getPosition, getWeather } from "../usefullStuff"
import { TableEntry } from "./DataTable"

export const InputTable = () => {    
    const [flightMetaData, setFlightMetaData] = useGlobalState("flightMetaData")
    const [,setCurrentAppMode] = useGlobalState("currentAppMode")
    const [automaticLocalisation, setAutomaticLocalisation] = useState(true)    
    const [automaticWeather, setAutomaticWeather] = useState(true)

    if("date" in flightMetaData) {
        setCurrentAppMode("Station")
    }

    const { frameRate, initialLatitude, initialLongitude, initialHeight, canSatMass, canSatSurfaceArea, airCS, windAzimuth, windSpeed } = flightMetaData as SimMetaData  

    useEffect(() => {
        (async () => {
            const {latitude, longitude} = (await getPosition()).coords
            const resp = await getWeather(latitude, longitude)
            setFlightMetaData({
                ...flightMetaData,
                initialLatitude: latitude,
                initialLongitude: longitude,
                ...resp
            })
        })()
    }, [automaticLocalisation])

    
    useEffect(() => {
        (async () => {
            if(automaticWeather) {
                const resp = await getWeather(initialLatitude, initialLongitude)
                if(resp !== null) {
                    setFlightMetaData({...flightMetaData, ...resp})
                }
            }
        })()
    }, [automaticWeather])

    const data: TableEntry[] = [
        {
            rowName: "Frame rate",
            value: <TextField
                type="number"
                value={frameRate}
                onChange={e => setFlightMetaData({...flightMetaData, frameRate: parseFloat(e.target.value)})}
                label="Frame rate"
            />
        },
        {
            rowName: "Initial height",
            value: <TextField
                type="number"
                value={initialHeight}
                onChange={e => setFlightMetaData({...flightMetaData, initialHeight: parseFloat(e.target.value)})}
                label="Initial height"
            />,
            unit: "m"
        },
        {
            rowName: "CanSat mass",
            value: <TextField
                type="number"
                value={canSatMass}
                onChange={e => setFlightMetaData({...flightMetaData, canSatMass: parseFloat(e.target.value)})}
                label="CanSat mass"
            />,
            unit: "kg"
        },
        {
            rowName: "Satellite side surface",
            value: <TextField
                type="number"
                value={canSatSurfaceArea}
                onChange={e => setFlightMetaData({...flightMetaData, canSatSurfaceArea: parseFloat(e.target.value)})}
                label="Satellite side surface"
            />,
            unit: <>m<sup>2</sup></>
        },
        {
            rowName: <>
                C * S parameter of air
                <a
                    href="https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna"
                    target="_blank"
                    rel="noopener noreferrer"
                > ? </a>
            </>,
            value: <TextField
                type="number"
                value={airCS}
                onChange={e => setFlightMetaData({...flightMetaData, airCS: parseFloat(e.target.value)})}
                label="C * S parameter of air"
            />
        },
        {
            rowName: "Automatic localisation",
            value: <Switch
                onChange={e => setAutomaticLocalisation(e.target.checked)}
                checked={automaticLocalisation}
            />,
        },
        {
            rowName: "Latitude",
            value: <TextField
                type="number"
                value={initialLatitude}
                onChange={e => setFlightMetaData({...flightMetaData, initialLatitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
                label="Latitude"
            />
        },
        {
            rowName: "Longitude",
            value: <TextField
                type="number"
                value={initialLongitude}
                onChange={e => setFlightMetaData({...flightMetaData, initialLongitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
                label="Longitude"
            />
        },
        {
            rowName: "Automatic wind",
            value: <Switch
                onChange={e => setAutomaticWeather(e.target.checked)}
                checked={automaticWeather}
            />
        },
        {
            rowName: "Wind speed",
            value: <TextField
                type="number"
                value={windSpeed}
                onChange={e => setFlightMetaData({...flightMetaData, windSpeed: parseFloat(e.target.value)})}
                disabled={automaticWeather}
                label="Wind speed"
            />,
            unit: "m/s",
        },
        {
            rowName: "Wind azimuth",
            value: <TextField
                type="number"
                value={windAzimuth}
                onChange={e => setFlightMetaData({...flightMetaData, windAzimuth: parseFloat(e.target.value)})}
                disabled={automaticWeather}
                label="Wind azimuth"
            />,
            unit: "°"
        }              
    ]

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