import { Switch, TableBody, TableCell, TableRow, TextField } from "@material-ui/core"
import React, { useEffect, useRef, useState } from "react"
import { simMetaDataState } from "../index"
import { useGlobalState } from "../globalState"
import { getPosition, getWeather } from "./weather&pos"
import { TableEntry } from "./DataTable"

export const InputTable = () => {    
    const [simMetaData, setSimMetaData] = useGlobalState(simMetaDataState)
    const [automaticLocalisation, setAutomaticLocalisation] = useState(true)    
    const [automaticWeather, setAutomaticWeather] = useState(true)
    const lastLongitude = useRef(0)
    const lastLatitude = useRef(0)    

    const { initialLatitude, initialLongitude, initialHeight, canSatMass, canSatSurfaceArea, airCS, windAzimuth, windSpeed, environmentSimulationInterval, satelliteSimulationInterval } = simMetaData
    
    useEffect(() => {
        (async () => {
            if(automaticLocalisation) {
                const {latitude, longitude} = (await getPosition()).coords
                if(initialLatitude !== latitude || initialLongitude !== longitude) {
                    setSimMetaData({
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
                    setSimMetaData({windAzimuth, windSpeed})                    
                }
            }
        })()
    }, [simMetaData, automaticLocalisation, automaticWeather])    

    const data: TableEntry[] = [        
        {
            rowName: "Initial height",
            value: <TextField
                type="number"
                value={initialHeight}                
                onChange={e => setSimMetaData({initialHeight: parseFloat(e.target.value)})}
                placeholder="Initial height"
            />,
            unit: "m"
        },
        {
            rowName: "CanSat mass",
            value: <TextField
                type="number"
                value={canSatMass}                
                onChange={e => setSimMetaData({canSatMass: parseFloat(e.target.value)})}
                placeholder="CanSat mass"
            />,
            unit: "kg"
        },
        {
            rowName: "Satellite side surface",
            value: <TextField
                type="number"
                value={canSatSurfaceArea}                
                onChange={e => setSimMetaData({canSatSurfaceArea: parseFloat(e.target.value)})}
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
                onChange={e => setSimMetaData({airCS: parseFloat(e.target.value)})}
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
                onChange={e => setSimMetaData({initialLatitude: parseFloat(e.target.value)})}
                disabled={automaticLocalisation}
                placeholder="Latitude"
            />
        },
        {
            rowName: "Longitude",
            value: <TextField
                type="number"
                value={initialLongitude}
                onChange={e => setSimMetaData({initialLongitude: parseFloat(e.target.value)})}
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
                onChange={e => setSimMetaData({windSpeed: parseFloat(e.target.value)})}
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
                onChange={e => setSimMetaData({windAzimuth: parseFloat(e.target.value)})}
                disabled={automaticWeather}
                placeholder="Wind azimuth"
            />,
            unit: "°"
        },
        {
            rowName: "Environment simulation interval",
            value: <TextField
                type="number"
                value={environmentSimulationInterval}
                onChange={e => setSimMetaData({environmentSimulationInterval: parseFloat(e.target.value)})}
                placeholder="Environment simulation interval"
            />,
            unit: "ms"
        },
        {
            rowName: "Satellite simulation",
            value: <TextField
                type="number"
                value={satelliteSimulationInterval}
                onChange={e => setSimMetaData({satelliteSimulationInterval: parseFloat(e.target.value)})}
                placeholder="Satellite simulation"
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