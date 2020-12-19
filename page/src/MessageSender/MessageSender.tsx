import { Paper, Table, TableBody, TableContainer, TableRow } from "@material-ui/core"
import React, { FC, useMemo } from "react"
import { useGlobalState } from "../globalState"
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"
import { currentAppModeState, isRunningState, serialWriterState } from ".."
import { EmergencySection } from "./EmergencySection"
import { PositionSection } from "./PositionSection"
import { AzimuthSection } from "./AzimuthSection"

interface props {
    removeUtility: () => void
    bigWindow: boolean
}

export const MessageSender: FC<props> = ({removeUtility, bigWindow}) => {
    const [isRunning] = useGlobalState(isRunningState)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [serialWriter] = useGlobalState(serialWriterState)    

    const settingsOptions: SettingsOption[] = useMemo(() => [
        {
            title: "Remove window",
            action: removeUtility        
        },
        {
            title: "Open in new window",
            action: () => {
                const newWindow = window.open("./", "_blank")
                if(newWindow) {
                    newWindow.defaultUtilities = ["Message sender"]
                }
                removeUtility()
            }
        }
    ], [])    

    return(
        <UtilityWindow settingsOptions={settingsOptions} bigWindow={bigWindow}>
            {(currentAppMode === "Station" && isRunning && serialWriter !== undefined) &&            
                <TableContainer component={ props => <Paper {...props} className="DataTable"/> }>
                    <Table>
                        <TableBody>
                            <EmergencySection serialWriter={serialWriter as WritableStreamDefaultWriter} />
                            <PositionSection serialWriter={serialWriter as WritableStreamDefaultWriter} />
                            <AzimuthSection serialWriter={serialWriter as WritableStreamDefaultWriter} />
                        </TableBody>
                    </Table>
                </TableContainer>        
            }    
        </UtilityWindow>
    )

}