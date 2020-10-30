import "./Table.scss"
import React from "react"

export interface TableEntry {
    rowName: any,
    value: any,
    renderCondition?: boolean,
    unit?: any 
}

interface props {
    data: TableEntry[]
}

export const Table: React.FC<props> = ({data}) => (
    <table className="Table">
        {
            data.map( ({rowName, value, renderCondition, unit}, index) => {
                if(renderCondition === undefined || renderCondition === true){
                    return(
                        <tbody key={index}>
                            <tr>
                                <th> { rowName } </th>
                                <th> { value }{ unit } </th>
                            </tr>
                        </tbody>
                    )
                }
                return null
            })
        }
    </table>
)