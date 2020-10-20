import React, { useCallback, useContext } from 'react'
import { startSimulation } from '..'
import { Switch } from '../Switch/Switch'
import { context } from '../App/App'
import { getPosition, getWeather } from '../usefullStuff'
import { Modes } from './MainComponent'
import { Table, TableEntry } from './Table'

interface OrangeSwitchProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const OrangeSwitch: React.FC<OrangeSwitchProps> = ({onChange}) => (
    <Switch
        switchHeight="15px"
        ballHeight="12px"
        animationDuration="0.25s"
        checkedColor="#fab132"
        onChange={onChange}
        defaultChecked={true}
    />
)

interface props {
    setMode: React.Dispatch<React.SetStateAction<Modes>>
}

export const SetData: React.FC<props> = ({setMode}) => {    
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
        setIsPaused
    } = useContext(context)

    const handleAutomaticLocalisationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const setLocalisation = async (): Promise<void> => {
            try {
                if(e.target.checked) {
                    const position = await getPosition()
                    const {latitude, longitude} = position.coords
                    setOriginalLatitude(latitude)
                    setOriginalLongitude(longitude)
                }            
            }
            catch(error) {
                console.error(error)
            }
        }
        setAutomaticLocalisation(e.target.checked)        
        setLocalisation()
    }

    const handleStart = async (): Promise<void> => {
        try {        
            if(automaticLocalisation) {
                const position = await getPosition()
                const {latitude, longitude} = position.coords
                setOriginalLatitude(latitude)
                setOriginalLongitude(longitude)
            }
            const weather = await getWeather(originalLatitude, originalLongitude)
            automaticWind && setWindSpeed(weather.wind_speed.value)
            automaticWind && setWindAzimuth(weather.wind_direction.value)
            setIsPaused(false)
            startSimulation()
            setMode(Modes.WatchData)
        }
        catch(error) {
            console.error(error)
        }
    }

    const data: Array<TableEntry> = [
        {
            rowName: "Początkowa wysokość",
            value: <input
                type="number"
                value={originalHeight}
                onChange={e => setOriginalHeight(parseFloat(e.target.value))}
            />,
            unit: "m"
        },
        {
            rowName: "Masa satelity",
            value: <input
                type="number"
                value={canSatMass}
                onChange={e => setCanSatMass(parseFloat(e.target.value))}
                step="0.01"
            />,
            unit: "kg"
        },
        {
            rowName: "Powierzchnia boczna satelity",
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
                Parametr C * S powietrza
                <a href="https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna" target="_blank"> ? </a>
            </>,
            value: <input
                type="number"
                value={airCS}
                onChange={e => setAirCS(parseFloat(e.target.value))}
                step="0.01"
            />
        },
        {
            rowName: "Automatyczna lokalizacja",
            value: <OrangeSwitch onChange={handleAutomaticLocalisationChange} />,
        },
        {
            rowName: "Szerokość geograficzna",
            value: <input
                type="number"
                value={originalLatitude}
                onChange={e => setOriginalLatitude(parseFloat(e.target.value))}
            />,
            renderCondition: !automaticLocalisation
        },
        {
            rowName: "Długość geograficzna",
            value: <input
                type="number"
                value={originalLongitude}
                onChange={e => setOriginalLongitude(parseFloat(e.target.value))}
            />,
            renderCondition: !automaticLocalisation
        },
        {
            rowName: "Automatyczny wiatr",
            value: <OrangeSwitch onChange={e => setAutomaticWind(e.target.checked)} />,
        },
        {
            rowName: "Prędkość wiatru przy ziemii",
            value: <input
                type="number"
                value={windSpeed}
                onChange={e => setWindSpeed(parseFloat(e.target.value))}
            />,
            unit: "m/s",
            renderCondition: !automaticWind
        },
        {
            rowName: "Azymut wiatru",
            value: <input
                type="number"
                value={windAzimuth}
                onChange={e => setWindAzimuth(parseFloat(e.target.value))}
            />,
            unit: <> &#176; </>,
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
