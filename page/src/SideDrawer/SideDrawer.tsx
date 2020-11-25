import { Drawer, ListItem, ListItemText } from "@material-ui/core"
import React, { FC } from "react"
import { DefaultSimFlightData, DefaultStationFlightData } from "../flightProperties"
import { AppMode, AppModes, useGlobalState } from "../index"

interface props {
    closeDrawer: () => void
    isDrawerOpened: boolean    
}

export const SideDrawer: FC<props> = ({closeDrawer, isDrawerOpened}) => {
    const [currentAppMode, setCurrentAppMode] = useGlobalState("currentAppMode")
    const [, setFlightProperties] = useGlobalState("flightProperties")

    const handleClick = (newMode: AppMode) => {
        if(newMode !== currentAppMode) {
            if(newMode === "Station") {
                setFlightProperties(DefaultStationFlightData)
            }
            else {
                setFlightProperties(DefaultSimFlightData)
            }
            setCurrentAppMode(newMode)
        }
        closeDrawer()
    }

    return(
        <Drawer open={isDrawerOpened} onClose={closeDrawer}>
            {
                AppModes.map((mode: AppMode, index: number) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => handleClick(mode)}
                        selected={currentAppMode === mode}
                    >
                        <ListItemText primary={mode} />
                    </ListItem>
                ))
            }
        </Drawer>
    )
}