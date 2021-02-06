import { Button, TableCell, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { flightDataState } from "../index"
import { sendMessage } from "../CSCP"
import { useGlobalState } from "../globalState"
import { MessageFrame, MessageCode, FlightDataMessageFrame } from "../flightProperties"

interface props {
    messageCode: MessageCode,
    buttonText: string
}

export const ShortMessageSection: FC<props> = ({ messageCode, buttonText }) => {
    const [flightData, setFlightData] = useGlobalState(flightDataState)

    const handleSend = () => {
        const message = new MessageFrame(messageCode)
        sendMessage(message)
        setFlightData({messageFrames: [...flightData.messageFrames, new FlightDataMessageFrame(message)]})
    }

    return (
        <TableRow>
            <TableCell>
                <Button onClick={handleSend}>{ buttonText }</Button>
            </TableCell>
        </TableRow>
    )
}