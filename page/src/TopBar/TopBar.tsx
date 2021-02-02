import "./TopBar.scss"
import React, { FC, useEffect, useState } from "react"
import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core"
import menuIcon from "./menuIcon.svg"
import { useGlobalState } from "../globalState"
import { currentAppModeState, isPausedState, isRunningState, Utility } from ".."
import { SideDrawer } from "./SideDrawer"
import { UtilitiesOpener } from "./UtilitiesOpener"
import pauseIcon from "./pauseIcon.svg"
import playIcon from "./playIcon.svg"
import { start, stop } from "../CSCP"

interface props {
    addUtility: (u: Utility) => void
}

export const TopBar: FC<props> = ({addUtility}) => {
    const [isRunning] = useGlobalState(isRunningState)
    const [isPaused, setIsPaused] = useGlobalState(isPausedState)    
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [isDrawerOpened, setIsDrawerOpened] = useState(true)
    const [device, setDevice] = useState<any | undefined>(undefined)

    const startStop = () => {
        if(!isRunning) {            
            if(currentAppMode === "Station") {
                start(device)
            }
            else if(currentAppMode === "Simulator") {
                start()
            }
            else {
                console.log("TopBar error")
            }
        }
        else {
            stop()
        }  
    }    

    const handleDeviceSelect = async () => {
        setDevice(await (navigator as any).serial.requestPort())
    }

    return(
        <AppBar className="TopBar" position="static" >
            <Toolbar variant="dense">
                <IconButton onClick={() => setIsDrawerOpened(true)} className="menuButton">
                    <img src={menuIcon} className="menuIcon" alt="menu" />
                </IconButton>
                <UtilitiesOpener addUtility={addUtility} />
                {isRunning &&
                    <IconButton onClick={() => setIsPaused(!isPaused, true)}>
                        <img src={isPaused? playIcon : pauseIcon} />
                    </IconButton>
                }                
                {currentAppMode === "Station" &&
                    <Button
                        variant="contained"
                        size="medium"
                        className="Button"
                        onClick={handleDeviceSelect}
                    >
                        { device === undefined? "Select device" : "Device is selected" }
                    </Button>
                }     
                <Button
                    variant="contained"
                    size="medium"
                    className="Button"
                    onClick={startStop}
                    disabled={currentAppMode === "Station" && device === undefined}
                >
                    { isRunning? "Stop" : "Run" }
                </Button>
            </Toolbar>
            <SideDrawer
                closeDrawer={() => setIsDrawerOpened(false)}
                isDrawerOpened={isDrawerOpened}          
            />
        </AppBar>
    )
}