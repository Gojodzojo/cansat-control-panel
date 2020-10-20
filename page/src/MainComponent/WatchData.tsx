import React, { useContext, useMemo } from "react"
import { pauseSimulation, resumeSimulation } from ".."
import { context } from "../App/App"
import { Modes } from "./MainComponent"
import { Table, TableEntry } from "./Table"

interface props {
    setMode: React.Dispatch<React.SetStateAction<Modes>>
}

export const WatchData: React.FC<props> = ({setMode}) => {    
    const {
        isPaused,
        setCanSatPosition,
        canSatPosition,
        originalHeight,
        velocity,
        time,
        setTime,
        windAzimuth,
        windSpeed,
        originalLatitude,
        originalLongitude,
        pressure
    } = useContext(context)    

    const degPerMeter = useMemo(() => {
        const earthRadius = 6371e3
        const earthCircumference = Math.PI * 2 * earthRadius
        return 360 / earthCircumference
    }, [])

    const handleCancel = () => {
        pauseSimulation()
        setCanSatPosition({x: 0, y: originalHeight, z: 0})
        setMode(Modes.SetData)
    }

    const currentLongitude = originalLongitude + canSatPosition.last().x * degPerMeter
    const currentLatitude = originalLatitude + canSatPosition.last().z * degPerMeter    

    const data: Array<TableEntry> = [
        {
            rowName: "Pozycja x",
            value: canSatPosition.last().x.toFixed(2)
        },
        {
            rowName: "Pozycja z",
            value: canSatPosition.last().z.toFixed(2)
        },
        {
            rowName: "Długość geograficzna",
            value: currentLongitude.toFixed(5)
        },
        {
            rowName: "Szerokość geograficzna",
            value: currentLatitude.toFixed(5)
        },
        {
            rowName: "Prędkość spadania",
            value: (velocity.last().y * -1).toFixed(1),
            unit: "m/s"
        },
        {
            rowName: "Wysokość",
            value: canSatPosition.last().y.toFixed(1),
            unit: "m"
        },
        {
            rowName: "Ciśnienie",
            value: pressure.last().toFixed(1),
            unit: "hPa"
        },
        {
            rowName: "Prędkość wiatru",
            value: windSpeed,
            unit: "m/s"
        },
        {
            rowName: "Azymut wiatru",
            value: windAzimuth,
            unit: <> &#176; </>
        },        
        {
            rowName: "Czas",
            value: time.last().toFixed(1),
            unit: "s"
        },
    ]

    return(
        <div className="WatchData">
            {isPaused?
                <button onClick={() => resumeSimulation()} >
                    Wznów
                </button>
                :
                <button onClick={() => pauseSimulation()} >
                    Pauza
                </button>
            }

            <button onClick={handleCancel} >
                Anuluj
            </button>
            <br />
            <Table data={data} />            
        </div>
    )
}