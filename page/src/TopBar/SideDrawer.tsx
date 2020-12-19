import { Drawer, ListItem, ListItemText } from "@material-ui/core"
import React, { FC } from "react"
import { SimData, StationData } from "../flightProperties"
import { useGlobalState } from "../globalState"
import { AppMode, AppModes, currentAppModeState, flightDataState } from "../index"

interface props {
    closeDrawer: () => void
    isDrawerOpened: boolean    
}

export const SideDrawer: FC<props> = ({closeDrawer, isDrawerOpened}) => {
    const [currentAppMode, setCurrentAppMode] = useGlobalState(currentAppModeState)
    const [, setFlightProperties] = useGlobalState(flightDataState)

    const handleClick = (newMode: AppMode) => {
        if(newMode !== currentAppMode) {
            if(newMode === "Station") {
                setFlightProperties(new StationData(), true)
            }
            else {
                setFlightProperties(new SimData(), true)
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