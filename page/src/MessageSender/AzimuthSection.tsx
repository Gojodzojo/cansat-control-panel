import { Button, Input, TableCell, TableRow } from "@material-ui/core"
import React, { FC, useState } from "react"
import { currentAppModeState, flightDataState, serialWriterState } from ".."
import { AzimuthOrder } from "../flightProperties"
import { useGlobalState } from "../globalState"

export const AzimuthSection: FC = () => {
    const [azimuth, setAzimuth] = useState(0)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [serialWriter] = useGlobalState(serialWriterState)
    const [flightData, setFlightData] = useGlobalState(flightDataState)


    const handleSend = async () => {
        if(currentAppMode === "Station" && serialWriter !== undefined) {
            const azimuthBytes =  new Uint8Array( new Int32Array([azimuth]).buffer )
            const data = new Uint8Array(azimuthBytes.length + 1)
            data[0] = 2
            data.set(azimuthBytes, 1)
            await serialWriter.write(data)
        }
        else if(currentAppMode === "Simulator") {
            //callAzimuthOrder()
        }
        setFlightData({orders: [...flightData.orders, new AzimuthOrder(azimuth)]})
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