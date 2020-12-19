import { Button, Input, TableCell, TableRow } from "@material-ui/core"
import React, { FC, useState } from "react"

interface props {
    serialWriter: WritableStreamDefaultWriter
}

export const AzimuthSection: FC<props> = ({serialWriter}) => {
    const [azimuth, setAzimuth] = useState(0)

    const handleSend = async () => {
        if(serialWriter !== undefined) {            
            const azimuthBytes =  new Uint8Array( new Int32Array([azimuth]).buffer )
            const data = new Uint8Array(azimuthBytes.length + 1)
            data[0] = 2
            data.set(azimuthBytes, 1)
            console.log(azimuthBytes)
            console.log(data)
            await serialWriter.write(data)
        }
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