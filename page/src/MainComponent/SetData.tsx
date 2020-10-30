import React, { useContext, useEffect } from 'react'
import { startSimulation } from '..'
import { context, ReducerActions } from '../App/App'
import { OrangeSwitch } from '../Switch/OrangeSwitch'
import { getPosition, getWeather } from '../usefullStuff'
import { AppModes } from './MainComponent'
import { Table, TableEntry } from './Table'

export const SetData: React.FC = () => {    
    const {
        originalHeight,
        setOriginalHeight,
        automaticLocalisation,
        setAutomaticLocalisation,
        automaticWind,
        setAutomaticWind,
        originalLongitude,
        setOriginalLongitude,
        originalLatitude,
        setOriginalLatitude,
        windSpeed,
        setWindSpeed,
        windAzimuth,
        setWindAzimuth,
        canSatMass,
        setCanSatMass,
        airCS, 
        setAirCS,
        canSatSurfaceArea,
        setCanSatSurfaceArea,
        setIsPaused,
        setAppMode,
        setFlightProperties
    } = useContext(context)

    const setLocalisation = async (): Promise<void> => {
        try {
            const position = await getPosition()
            const {latitude, longitude} = position.coords
            setOriginalLatitude(latitude)
            setOriginalLongitude(longitude)                
        }
        catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {setLocalisation()}, [automaticLocalisation])

    const handleStart = async (): Promise<void> => {
        try {        
            if(automaticLocalisation) {
                await setLocalisation()
            }
            const weather = await getWeather(originalLatitude, originalLongitude)
            automaticWind && setWindSpeed(weather.wind_speed.value)
            automaticWind && setWindAzimuth(weather.wind_direction.value)
            setIsPaused(false)
            setFlightProperties(ReducerActions.reset)
            setAppMode(AppModes.WatchData)
            startSimulation()
        }
        catch(error) {
            console.error(error)
        }
    }

    const data: Array<TableEntry> = [
        {
            rowName: "Original height",
            value: <input
                type="number"
                value={originalHeight}
                onChange={e => setOriginalHeight(parseFloat(e.target.value))}
            />,
            unit: "m"
        },
        {
            rowName: "CanSat mass",
            value: <input
                type="number"
                value={canSatMass}
                onChange={e => setCanSatMass(parseFloat(e.target.value))}
                step="0.01"
            />,
            unit: "kg"
        },
        {
            rowName: "Satellite side surface",
            value: <input
                type="number"
                value={canSatSurfaceArea}
                onChange={e => setCanSatSurfaceArea(parseFloat(e.target.value))}
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
                onChange={e => setAirCS(parseFloat(e.target.value))}
                step="0.01"
            />
        },
        {
            rowName: "Automatic localisation",
            value: <OrangeSwitch
                onChange={e => setAutomaticLocalisation(e.target.checked)}
                checked={automaticLocalisation}
            />,
        },
        {
            rowName: "Latitude",
            value: <input
                type="number"
                value={originalLatitude}
                onChange={e => setOriginalLatitude( parseFloat(e.target.value) )}
            />,
            renderCondition: !automaticLocalisation
        },
        {
            rowName: "Longitude",
            value: <input
                type="number"
                value={originalLongitude}
                onChange={e => setOriginalLongitude(parseFloat(e.target.value))}
            />,
            renderCondition: !automaticLocalisation
        },
        {
            rowName: "Automatic wind",
            value: <OrangeSwitch
                onChange={e => setAutomaticWind(e.target.checked)}
                checked={automaticWind}
            />
        },
        {
            rowName: "Wind speed",
            value: <input
                type="number"
                value={windSpeed}
                onChange={e => setWindSpeed(parseFloat(e.target.value))}
            />,
            unit: "m/s",
            renderCondition: !automaticWind
        },
        {
            rowName: "Wind azimuth",
            value: <input
                type="number"
                value={windAzimuth}
                onChange={e => setWindAzimuth(parseFloat(e.target.value))}
            />,
            unit: "°",
            renderCondition: !automaticWind
        }        
    ]

    return (
        <div className="SetData">
            <Table data={data} />                                                                                             
            <button onClick={handleStart}>
                Start
            </button>
        </div>
    )
}
