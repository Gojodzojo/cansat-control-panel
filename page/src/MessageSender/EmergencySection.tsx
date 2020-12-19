import { Button, TableCell, TableRow } from "@material-ui/core"
import React, { FC } from "react"

interface props {
    serialWriter: WritableStreamDefaultWriter
}

export const EmergencySection: FC<props> = ({serialWriter}) => {

    const handleEmergency = async () => {
        if(serialWriter !== undefined) {
            const data = new Uint8Array([3])
            await serialWriter.write(data)
        }
    }

    return (
        <TableRow>
            <TableCell>
                <Button onClick={handleEmergency}> Send emergency message </Button>
            </TableCell>
        </TableRow>
    )
}