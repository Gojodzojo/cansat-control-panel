import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core"
import React, { FC } from "react"
import { useGlobalState } from "../globalState"
import { UtilityWindow } from "../UtilityWindow/UtilityWindow"
import { currentAppModeState, isRunningState } from "../index"
import { ShortMessageSection } from "./ShortMessageSection"
import { PositionSection } from "./PositionSection"
import { AzimuthSection } from "./AzimuthSection"
import { OperationCode } from "../flightProperties"

interface props {
    removeUtility: () => void
    openInNewWindow: () => void
    bigWindow: boolean
}

export const MessageSender: FC<props> = ({ removeUtility, openInNewWindow, bigWindow }) => {
    const [isRunning] = useGlobalState(isRunningState)
    const [currentAppMode] = useGlobalState(currentAppModeState)

    return(
        <UtilityWindow
            settingsOptions={[]}
            bigWindow={bigWindow}
            removeUtility={removeUtility}
            openInNewWindow={openInNewWindow}
        >            
            <TableContainer component={ props => <Paper {...props} className="DataTable"/> }>
                <Table>
                    <TableBody>
                        {isRunning && currentAppMode !== "Player"?
                            <>
                                <PositionSection />
                                <AzimuthSection />
                                <ShortMessageSection buttonText="Send emergency message" operationCode={OperationCode.emergency} />
                                <ShortMessageSection buttonText="Send calibration message" operationCode={OperationCode.calibration} />
                                <ShortMessageSection buttonText="Send wait message" operationCode={OperationCode.wait} />
                            </>
                            :
                            <TableRow>
                                <TableCell>
                                    Waiting for flight to start
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>                    
        </UtilityWindow>
    )

}