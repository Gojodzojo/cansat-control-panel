import { Button, TableCell, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { currentAppModeState, flightDataState, serialWriterState } from ".."
import { EmergencyOrder } from "../flightProperties"
import { useGlobalState } from "../globalState"



export const EmergencySection: FC = () => {
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [serialWriter] = useGlobalState(serialWriterState)
    const [flightData, setFlightData] = useGlobalState(flightDataState)

    const handleEmergency = async () => {
        if(currentAppMode === "Station" && serialWriter !== undefined) {            
            const data = new Uint8Array([3])
            await serialWriter.write(data)                            
        }
        else if(currentAppMode === "Simulator") {
            //callEmergencyOrder()            
        }
        setFlightData({orders: [...flightData.orders, new EmergencyOrder()]})
    }

    return (
        <TableRow>
            <TableCell>
                <Button onClick={handleEmergency}> Send emergency message </Button>
            </TableCell>
        </TableRow>
    )
}