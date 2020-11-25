import "./TopBar.scss"
import React, { FC, useEffect, useMemo } from "react"
import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core"
import menuIcon from "./menuIcon.svg"
import { simulate } from "../simulate"
import { useGlobalState } from ".."

interface props {
    openDrawer: () => void
}

export const TopBar: FC<props> = ({openDrawer}) => {
    const [isRunning, setIsRunning] = useGlobalState("isRunning")
    const [flightMetaData] = useGlobalState("flightMetaData")
    const [currentAppMode] = useGlobalState("currentAppMode")
    
    const doMagic = () => {
        if("date" in flightMetaData && currentAppMode === "Station") {            
            //watchForData()
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
    

    return(
        <AppBar className="TopBar" position="static" >
            <Toolbar className="toolbar">
                <IconButton onClick={openDrawer}>
                    <img src={menuIcon} className="menuIcon" alt="menu" />
                </IconButton>
                <Button
                    variant="contained"
                    size="large"
                    className="runButton"
                    onClick={() => setIsRunning(!isRunning)}
                >
                    { isRunning? "Stop" : "Run" }
                </Button>
            </Toolbar>
        </AppBar>
    )
}