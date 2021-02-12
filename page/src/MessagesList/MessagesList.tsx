import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { currentFrameNumberState, flightDataState } from ".."
import { useGlobalState } from "../globalState"
import { AzimuthMessageFrame, MessageCode, PositionMessageFrame } from "../flightProperties"
import { UtilityWindow } from "../UtilityWindow/UtilityWindow"

interface props {
    removeUtility: () => void
    openInNewWindow: () => void
    bigWindow: boolean
}

export const MessagesList: FC<props> = ({ removeUtility, openInNewWindow, bigWindow }) => {
    const [{messageFrames}] = useGlobalState(flightDataState)
    useGlobalState(currentFrameNumberState)    

    const rows = messageFrames.map(({messageFrame, state}, index) => {
        let rowName = ""
        let extraInfo = <></>
        switch (messageFrame.messageCode) {
            case MessageCode.position:
                const { longitude, latitude } = messageFrame as PositionMessageFrame
                rowName = "Position message"
                extraInfo = <>
                    <TableCell> Longitude: { longitude } </TableCell>
                    <TableCell> latitude: { latitude } </TableCell>
                </>
                break;
            case MessageCode.azimuth:
                const { azimuth } = messageFrame as AzimuthMessageFrame
                rowName = "Azimuth message"
                extraInfo = <>
                    <TableCell> Azimuth: { azimuth }° </TableCell>
                </>
                break;
            case MessageCode.emergency:
                rowName = "Emergency message"
                break
            case MessageCode.calibration:
                rowName = "Calibration message"
                break
            case MessageCode.wait:
                rowName = "Wait message"
                break
            default:
                rowName = "Error"
                break;
        }
        
        return (            
            <TableRow key={index}>
                <TableCell>{ rowName }</TableCell>
                { extraInfo }
                <TableCell>{ state }</TableCell>
            </TableRow>
        ) 
    })

    return (
        <UtilityWindow
            settingsOptions={[]}
            bigWindow={bigWindow}
            removeUtility={removeUtility}
            openInNewWindow={openInNewWindow}
        >            
            <TableContainer component={ props => <Paper {...props} className="DataTable"/> }>
                <Table>
                    <TableBody>
                        { rows }
                    </TableBody>
                </Table>
            </TableContainer>
        </UtilityWindow>
    )
}