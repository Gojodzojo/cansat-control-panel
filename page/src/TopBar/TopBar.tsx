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
    const [flightMetaData] = useGlobalState(flightDataState)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [isDrawerOpened, setIsDrawerOpened] = useState(true)    

    const doMagic = () => {        
        if("date" in flightMetaData && currentAppMode === "Station") {            
            watchForData()
        }
        else if("frameRate" in flightMetaData && currentAppMode === "Simulator") {
            simulate()
        }                
    }

    useEffect(() => {
        if(isRunning) {            
            doMagic()
        }        
    }, [isRunning])    

    /*function handleStartStop() {
        setIs !$isRunning
        if($isRunning) {
          if($currentAppMode === "Simulator") {
            simulate()
          }
          else if($currentAppMode === "Station") {
            watchForData(device)
          }
        }
      }*/
    

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
                <Button
                    variant="contained"
                    size="medium"
                    className="runButton"
                    onClick={() => setIsRunning(!isRunning, true)}
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