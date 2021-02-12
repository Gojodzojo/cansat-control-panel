import { Button, Input, TableCell, TableRow } from "@material-ui/core"
import React, { FC, useMemo, useState } from "react"
import { flightDataState } from "../index"
import { sendMessage } from "../CSCP"
import { AzimuthMessageFrame, FlightDataMessageFrame } from "../flightProperties"
import { useGlobalState } from "../globalState"

export const AzimuthSection: FC = () => {
    const [azimuth, setAzimuth] = useState(0)    
    const [flightData, setFlightData] = useGlobalState(flightDataState)

    const handleSend = () => {
        const message = new AzimuthMessageFrame(azimuth)
        sendMessage(message)
        setFlightData({messageFrames: [...flightData.messageFrames, new FlightDataMessageFrame(message)]})
    }

    return (
        <TableRow>
            <TableCell>
                Azimuth:
                <Input
                    type="number"
                    value={azimuth}
                    onChange={e => setAzimuth(parseFloat(e.target.value))}
                    placeholder="Latitude"
                />
            </TableCell>
            <TableCell>
                <Button onClick={handleSend}> Send new azimuth </Button>
            </TableCell>
        </TableRow>
    )
}