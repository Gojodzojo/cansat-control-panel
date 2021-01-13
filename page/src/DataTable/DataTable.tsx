import "./DataTable.scss"
import { Paper, TableContainer, Table } from "@material-ui/core"
import React, { FC, useMemo} from "react"
import { OutputTable } from "./OutputTable"
import { InputTable } from "./InputTable"
import { useGlobalState } from "../globalState"
import { currentAppModeState, isRunningState } from ".."
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"

export interface TableEntry {
    rowName: any,
    value: any,
    unit?: any 
}

interface props {
    removeUtility: () => void
    openInNewWindow: () => void
    bigWindow: boolean
}

export const DataTable: FC<props> = ({removeUtility, openInNewWindow, bigWindow}) => {    
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [isRunning] = useGlobalState(isRunningState)

    const settingsOptions: SettingsOption[] = useMemo(() => [
        {
            title: "Remove window",
            action: removeUtility        
        },
        {
            title: "Open in new window",
            action: openInNewWindow
        }
    ], [])
       
    return(
        <UtilityWindow
            settingsOptions={settingsOptions}
            bigWindow={bigWindow}
            removeUtility={removeUtility}
            openInNewWindow={openInNewWindow}
        >
            <TableContainer component={ props => <Paper {...props} className="DataTable"/> }>
                <Table>
                    {currentAppMode === "Simulator" && isRunning === false?
                        <InputTable />
                        :
                        <OutputTable />
                    }
                </Table>            
            </TableContainer>
        </UtilityWindow>
    )
}