import { Button, Input, TableCell, TableRow } from "@material-ui/core"
import React, { FC, useState } from "react"
import { flightDataState } from ".."
import { sendMessage } from "../CSCP"
import { useGlobalState } from "../globalState"
import { PositionMessageFrame } from "../flightProperties"

export const PositionSection: FC = () => {
    const [flightData, setFlightData] = useGlobalState(flightDataState)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    const handleSend = () => {
        const message = new PositionMessageFrame(longitude, latitude)
        sendMessage(message.toBytes())
        setFlightData({orders: [...flightData.orders, message]})
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