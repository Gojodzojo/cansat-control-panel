import "./DataTable.scss"
import { Paper, TableContainer, Table } from "@material-ui/core"
import React from "react"
import { OutputTable } from "./OutputTable"
import { InputTable } from "./InputTable"
import { useGlobalState } from ".."

export interface TableEntry {
    rowName: any,
    value: any,
    unit?: any 
}

export const DataTable = () => {    
    const [appMode] = useGlobalState("currentAppMode")
    const [isRunning] = useGlobalState("isRunning")

    return(
        <TableContainer component={Paper}>
            <Table >
                {appMode === "Simulator" && isRunning === false?
                    <InputTable />
                    :
                    <OutputTable />
                }
            </Table>
        </TableContainer>
    )
}