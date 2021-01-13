import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core"
import React, { FC, useMemo } from "react"
import { useGlobalState } from "../globalState"
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"
import { currentAppModeState, isRunningState, serialWriterState } from ".."
import { EmergencySection } from "./EmergencySection"
import { PositionSection } from "./PositionSection"
import { AzimuthSection } from "./AzimuthSection"

interface props {
    removeUtility: () => void
    openInNewWindow: () => void
    bigWindow: boolean
}

export const MessageSender: FC<props> = ({removeUtility, openInNewWindow, bigWindow}) => {
    const [isRunning] = useGlobalState(isRunningState)        

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
                            {isRunning?
                                <>
                                    <EmergencySection />
                                    <PositionSection />
                                    <AzimuthSection />
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