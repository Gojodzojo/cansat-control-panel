import { Switch, TableBody, TableCell, TableRow } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useGlobalState } from ".."
import { SimFlightData } from "../flightProperties"
import { getPosition, getWeather } from "../usefullStuff"
import { TableEntry } from "./DataTable"

export const InputTable = () => {    
    const [flightProperties, setFlightProperties] = useGlobalState("flightProperties")
    const [,setCurrentAppMode] = useGlobalState("currentAppMode")
    const [automaticLocalisation, setAutomaticLocalisation] = useState(true)    
    const [automaticWeather, setAutomaticWeather] = useState(true)

    if("date" in flightProperties) {
        setCurrentAppMode("Station")
    }

    const { frameRate, initialLatitude, initialLongitude, initialHeight, canSatMass, canSatSurfaceArea, airCS, windAzimuth, windSpeed } = flightProperties as SimFlightData    

    useEffect(() => {
        (async () => {
            const {latitude, longitude} = (await getPosition()).coords
            const resp = await getWeather(latitude, longitude)
            setFlightProperties({
                ...flightProperties,
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
                    setFlightProperties({...flightProperties, ...resp})
                }
            }
        })()
    }, [automaticWeather])

    const data: TableEntry[] = [
        {
            rowName: "Frame rate",
            value: <input
                type="number"
                value={frameRate}
                onChange={e => setFlightProperties({...flightProperties, frameRate: parseFloat(e.target.value)})}
            />
        },
        {
            rowName: "Initial height",
            value: <input
                type="number"
                value={initialHeight}
                onChange={e => setFlightProperties({...flightProperties, initialHeight: parseFloat(e.target.value)})}
            />,
            unit: "m"
        },
        {
            rowName: "CanSat mass",
            value: <input
                type="number"
                value={canSatMass}
                onChange={e => setFlightProperties({...flightProperties, canSatMass: parseFloat(e.target.value)})}
                step="0.01"
            />,
            unit: "kg"
        },
        {
            rowName: "Satellite side surface",
            value: <input
                type="number"
                value={canSatSurfaceArea}
                onChange={e => setFlightProperties({...flightProperties, canSatSurfaceArea: parseFloat(e.target.value)})}
                step="0.01"
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
            value: <input
                type="number"
                value={airCS}
                onChange={e => setFlightProperties({...flightProperties, airCS: parseFloat(e.target.value)})}
                step="0.01"
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
            value: <input
                type="number"
                value={initialLatitude}
                onChange={e => setFlightProperties({...flightProperties, initialLatitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
            />
        },
        {
            rowName: "Longitude",
            value: <input
                type="number"
                value={initialLongitude}
                onChange={e => setFlightProperties({...flightProperties, initialLongitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
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
            value: <input
                type="number"
                value={windSpeed}
                onChange={e => setFlightProperties({...flightProperties, windSpeed: parseFloat(e.target.value)})}
                disabled={automaticWeather}
            />,
            unit: "m/s",
        },
        {
            rowName: "Wind azimuth",
            value: <input
                type="number"
                value={windAzimuth}
                onChange={e => setFlightProperties({...flightProperties, windAzimuth: parseFloat(e.target.value)})}
                disabled={automaticWeather}
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