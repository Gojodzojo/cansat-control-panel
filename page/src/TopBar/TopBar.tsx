import "./TopBar.scss"
import React, { FC, useState } from "react"
import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core"
import menuIcon from "./menuIcon.svg"
import { useGlobalState } from "../globalState"
import { currentAppModeState, flightDataState, isPausedState, isRunningState, Utility } from "../index"
import { SideDrawer } from "./SideDrawer"
import { UtilitiesOpener } from "./UtilitiesOpener"
import pauseIcon from "./pauseIcon.svg"
import playIcon from "./playIcon.svg"
import saveIcon from "./saveIcon.svg"
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

    const saveJSON =() => {
        const a = document.createElement("a");
        const file = new Blob([ JSON.stringify(flightDataState.getValue().frames) ])
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();
        a.remove()
    }

    return(
        <AppBar className="TopBar" position="static" >
            <Toolbar variant="dense">
                <IconButton onClick={() => setIsDrawerOpened(true)} className="menuButton">
                    <img src={menuIcon} className="menuIcon" alt="menu" />
                </IconButton>
                <UtilitiesOpener addUtility={addUtility} />
                {isRunning && currentAppMode !== "Player" &&
                    <>
                        <IconButton onClick={() => setIsPaused(!isPaused, true)}>
                            <img src={isPaused? playIcon : pauseIcon} alt="play/pause" />
                        </IconButton>
                        <IconButton onClick={saveJSON}>
                            <img src={saveIcon} alt="play/pause" />
                        </IconButton>
                    </>
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