import "./TopBar.scss"
import React, { FC, useEffect, useState } from "react"
import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core"
import menuIcon from "./menuIcon.svg"
import { simulate } from "../simulate"
import { useGlobalState } from "../globalState"
import { currentAppModeState, flightDataState, isPausedState, isRunningState, Utility } from ".."
import { SideDrawer } from "./SideDrawer"
import { UtilitiesOpener } from "./UtilitiesOpener"
import pauseIcon from "./pauseIcon.svg"
import playIcon from "./playIcon.svg"
import { watchForData } from "../watchForData"

interface props {
    addUtility: (u: Utility) => void
}

export const TopBar: FC<props> = ({addUtility}) => {
    const [isRunning, setIsRunning] = useGlobalState(isRunningState)
    const [isPaused, setIsPaused] = useGlobalState(isPausedState)
    const [flightData] = useGlobalState(flightDataState)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [isDrawerOpened, setIsDrawerOpened] = useState(true)
    const [device, setDevice] = useState<any | undefined>(undefined)

    useEffect(() => {
        if(isRunning) {            
            if("date" in flightData && currentAppMode === "Station") {
                watchForData(device)
            }
            else if("frameRate" in flightData && currentAppMode === "Simulator") {
                simulate()
            }
            else {
                console.log("TopBar error")
            }
        }        
    }, [isRunning])    

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
                    onClick={() => setIsRunning(!isRunning)}
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