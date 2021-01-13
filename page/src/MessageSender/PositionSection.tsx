import { Button, Input, TableCell, TableRow } from "@material-ui/core"
import React, { FC, useState } from "react"
import { currentAppModeState, flightDataState, serialWriterState } from ".."
import { PositionOrder } from "../flightProperties"
import { useGlobalState } from "../globalState"

export const PositionSection: FC = () => {
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [serialWriter] = useGlobalState(serialWriterState)
    const [flightData, setFlightData] = useGlobalState(flightDataState)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    const handleSend = async () => {
        if(currentAppMode === "Station" && serialWriter !== undefined) {
            const longitudeBytes = new Uint8Array( new Int32Array([longitude * Math.pow(10, 6)]).buffer )            
            const latitudeBytes = new Uint8Array( new Int32Array([latitude * Math.pow(10, 6)]).buffer )
            const data = new Uint8Array(latitudeBytes.length + longitudeBytes.length + 1)
            data[0] = 1
            data.set(longitudeBytes, 1)
            data.set(latitudeBytes, longitudeBytes.length + 1) 
            await serialWriter.write(data)
        }
        else if(currentAppMode === "Simulator") {
            //callPositionOrder(longitude, latitude)
        }
        setFlightData({orders: [...flightData.orders, new PositionOrder(longitude, latitude)]})
    }    

    return (
        <TableRow>
            <TableCell>
                Latitude: 
                <Input
                    type="number"
                    value={latitude}
                    onChange={e => setLatitude(parseFloat(e.target.value))}
                    placeholder="Latitude"
                />
            </TableCell>
            <TableCell>
                Longitude: 
                <Input
                    type="number"
                    value={longitude}
                    onChange={e => setLongitude(parseFloat(e.target.value))}
                    placeholder="Longitude"
                />                
            </TableCell>
            <TableCell>
                <Button onClick={handleSend}> Send new position </Button>
            </TableCell>
        </TableRow>
    )
}