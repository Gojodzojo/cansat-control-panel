import { Button, TableCell, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { currentAppModeState, flightDataState } from ".."
import { sendMessage } from "../CSCP"
import { EmergencyMessageFrame } from "../flightProperties"
import { useGlobalState } from "../globalState"



export const EmergencySection: FC = () => {
    const [flightData, setFlightData] = useGlobalState(flightDataState)

    const handleSend = () => {
        const message = new EmergencyMessageFrame()
        sendMessage(message.toBytes())
        setFlightData({orders: [...flightData.orders, message]})
    }

    return (
        <TableRow>
            <TableCell>
                <Button onClick={handleSend}> Send emergency message </Button>
            </TableCell>
        </TableRow>
    )
}