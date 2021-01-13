import { Switch, TableBody, TableCell, TableRow, TextField } from "@material-ui/core"
import React, { useEffect, useRef, useState } from "react"
import { currentAppModeState, flightDataState } from ".."
import { SimData } from "../flightProperties"
import { GlobalState, useGlobalState } from "../globalState"
import { getPosition, getWeather } from "./weather&pos"
import { TableEntry } from "./DataTable"

export const InputTable = () => {    
    const [flightData, setFlightData] = useGlobalState(flightDataState as GlobalState<SimData>)
    const [,setCurrentAppMode] = useGlobalState(currentAppModeState)
    const [automaticLocalisation, setAutomaticLocalisation] = useState(true)    
    const [automaticWeather, setAutomaticWeather] = useState(true)
    const lastLongitude = useRef(0)
    const lastLatitude = useRef(0)

    if("date" in flightData) {
        setCurrentAppMode("Station", true)
    }

    const { frameRate, initialLatitude, initialLongitude, initialHeight, canSatMass, canSatSurfaceArea, airCS, windAzimuth, windSpeed } = flightData as SimData
    
    useEffect(() => {
        (async () => {
            if(automaticLocalisation) {
                const {latitude, longitude} = (await getPosition()).coords
                if(initialLatitude !== latitude || initialLongitude !== longitude) {
                    setFlightData({
                        initialLatitude: latitude,
                        initialLongitude: longitude                        
                    })                    
                }
            }
            if(automaticWeather && (initialLatitude !== lastLatitude.current || initialLongitude !== lastLongitude.current)) {
                lastLongitude.current = initialLongitude
                lastLatitude.current = initialLatitude
                const result = await getWeather(initialLatitude, initialLongitude)
                if(result !== null) {
                    const {windAzimuth, windSpeed} = result
                    setFlightData({windAzimuth, windSpeed})                    
                }
            }
        })()
    }, [flightData, automaticLocalisation, automaticWeather])    

    const data: TableEntry[] = [
        {
            rowName: "Frame rate",
            value: <TextField
                type="number"
                value={frameRate}
                onChange={e => setFlightData({frameRate: parseFloat(e.target.value)})}
                placeholder="Frame rate"
            />
        },
        {
            rowName: "Initial height",
            value: <TextField
                type="number"
                value={initialHeight}                
                onChange={e => setFlightData({initialHeight: parseFloat(e.target.value)})}
                placeholder="Initial height"
            />,
            unit: "m"
        },
        {
            rowName: "CanSat mass",
            value: <TextField
                type="number"
                value={canSatMass}                
                onChange={e => setFlightData({canSatMass: parseFloat(e.target.value)})}
                placeholder="CanSat mass"
            />,
            unit: "kg"
        },
        {
            rowName: "Satellite side surface",
            value: <TextField
                type="number"
                value={canSatSurfaceArea}                
                onChange={e => setFlightData({canSatSurfaceArea: parseFloat(e.target.value)})}
                placeholder="Satellite side surface"
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
                onChange={e => setFlightData({airCS: parseFloat(e.target.value)})}
                placeholder="C * S parameter of air"
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
                onChange={e => setFlightData({initialLatitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
                placeholder="Latitude"
            />
        },
        {
            rowName: "Longitude",
            value: <TextField
                type="number"
                value={initialLongitude}
                onChange={e => setFlightData({initialLongitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
                placeholder="Longitude"
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
                onChange={e => setFlightData({windSpeed: parseFloat(e.target.value)})}
                disabled={automaticWeather}
                placeholder="Wind speed"
            />,
            unit: "m/s",
        },
        {
            rowName: "Wind azimuth",
            value: <TextField
                type="number"
                value={windAzimuth}
                onChange={e => setFlightData({windAzimuth: parseFloat(e.target.value)})}
                disabled={automaticWeather}
                placeholder="Wind azimuth"
            />,
            unit: "°"
        }
    ]

    return(
        <TableBody>
            {
                data.map(({rowName, value, unit}) => (
                    <TableRow key={rowName}>
                        <TableCell align="left"> {rowName} </TableCell>
                        <TableCell align="right"> {value} {unit && unit} </TableCell>                
                    </TableRow>
                ))
            }
        </TableBody>
    )
}