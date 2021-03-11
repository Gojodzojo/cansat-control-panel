import { Button, TableCell, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { flightDataState } from "../index"
import { sendMessage } from "../CSCP"
import { useGlobalState } from "../globalState"
import { MessageFrame, OperationCode, FlightDataMessageFrame } from "../flightProperties"

interface props {
    operationCode: OperationCode,
    buttonText: string
}

export const ShortMessageSection: FC<props> = ({ operationCode, buttonText }) => {
    const [flightData, setFlightData] = useGlobalState(flightDataState)

    const handleSend = () => {
        const message = new MessageFrame(operationCode)
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