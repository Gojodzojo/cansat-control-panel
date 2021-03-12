import { Drawer, ListItem, ListItemText } from "@material-ui/core"
import React, { FC } from "react"
import { useGlobalState } from "../globalState"
import { AppMode, AppModes, currentAppModeState, currentFrameNumberState, flightDataState } from "../index"

interface props {
    closeDrawer: () => void
    isDrawerOpened: boolean    
}

export const SideDrawer: FC<props> = ({closeDrawer, isDrawerOpened}) => {
    const [currentAppMode, setCurrentAppMode] = useGlobalState(currentAppModeState)
    const [, setFlightData] = useGlobalState(flightDataState)
    const [, setCurrentFrameNumber] = useGlobalState(currentFrameNumberState)

    const handleClick = (newMode: AppMode) => {
        if(newMode !== currentAppMode) {
            setCurrentFrameNumber(-1)
            setFlightData({frames: [], messageFrames: []})        
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