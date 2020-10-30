import React, { useContext, useMemo } from "react"
import { pauseSimulation, resumeSimulation } from ".."
import { context, ReducerActions } from "../App/App"
import { AppModes } from "./MainComponent"
import { Table, TableEntry } from "./Table"

export const WatchData: React.FC = () => {    
    const {
        isPaused,
        windAzimuth,
        windSpeed,
        originalLatitude,
        originalLongitude,
        flightProperties,
        setFlightProperties,
        setAppMode
    } = useContext(context)    

    const {canSatPosition, velocity, pressure, time} = flightProperties.last()

    const degPerMeter = useMemo(() => {
        const earthRadius = 6371e3
        const earthCircumference = Math.PI * 2 * earthRadius
        return 360 / earthCircumference
    }, [])

    const handleCancel = async () => {
        await pauseSimulation()        
        setAppMode(AppModes.SetData)
    }

    const currentLongitude = originalLongitude + canSatPosition.x * degPerMeter
    const currentLatitude = originalLatitude + canSatPosition.z * degPerMeter    

    const data: Array<TableEntry> = [
        {
            rowName: "Position x",
            value: canSatPosition.x.toFixed(2)
        },
        {
            rowName: "Position z",
            value: canSatPosition.z.toFixed(2)
        },
        {
            rowName: "Longitude",
            value: currentLongitude.toFixed(5)
        },
        {
            rowName: "Latitude",
            value: currentLatitude.toFixed(5)
        },
        {
            rowName: "Falling velocity",
            value: (velocity.y * -1).toFixed(1),
            unit: "m/s"
        },
        {
            rowName: "Height",
            value: canSatPosition.y.toFixed(1),
            unit: "m"
        },
        {
            rowName: "Pressure",
            value: pressure.toFixed(1),
            unit: "hPa"
        },
        {
            rowName: "Wind speed",
            value: windSpeed,
            unit: "m/s"
        },
        {
            rowName: "Wind azimuth",
            value: windAzimuth,
            unit: "°"
        },        
        {
            rowName: "Time",
            value: time.toFixed(1),
            unit: "s"
        },
    ]

    return(
        <div className="WatchData">
            {(canSatPosition.y !== 0) && (isPaused?
                <button onClick={() => resumeSimulation()} >
                    Resume
                </button>
                :
                <button onClick={() => pauseSimulation()} >
                    Pause
                </button>   
            )}

            {(canSatPosition.y === 0 || isPaused) &&
                <button>
                    Save
                </button>
            }

            <button onClick={handleCancel} >
                Cancel
            </button>
            <br />
            <Table data={data} />            
        </div>
    )
}