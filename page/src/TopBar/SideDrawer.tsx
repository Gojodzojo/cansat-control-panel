import { Drawer, ListItem, ListItemText } from "@material-ui/core"
import React, { FC } from "react"
import { useGlobalState } from "../globalState"
import { AppMode, AppModes, currentAppModeState } from "../index"

interface props {
    closeDrawer: () => void
    isDrawerOpened: boolean    
}

export const SideDrawer: FC<props> = ({closeDrawer, isDrawerOpened}) => {
    const [currentAppMode, setCurrentAppMode] = useGlobalState(currentAppModeState)

    const handleClick = (newMode: AppMode) => {
        if(newMode !== currentAppMode) {            
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