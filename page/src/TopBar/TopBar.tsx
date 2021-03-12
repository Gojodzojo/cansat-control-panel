import "./TopBar.scss"
import React, { FC, useRef, useState } from "react"
import { AppBar, Button, IconButton, Slider, Toolbar, Mark } from "@material-ui/core"
import menuIcon from "./menuIcon.svg"
import { useGlobalState } from "../globalState"
import { currentAppModeState, currentFrameNumberState, flightDataState, isRunningState, Utility } from "../index"
import { SideDrawer } from "./SideDrawer"
import { UtilitiesOpener } from "./UtilitiesOpener"
import saveIcon from "./saveIcon.svg"
import publishIcon from "./publishIcon.svg"
import { start, stop } from "../CSCP"
import { DataFrame } from "../flightProperties"

interface props {
    addUtility: (u: Utility) => void
}

export const TopBar: FC<props> = ({addUtility}) => {
    const [isRunning] = useGlobalState(isRunningState)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [flightData, setFlightData] = useGlobalState(flightDataState)
    const [currentFrameNumber, setCurrentFrameNumber] = useGlobalState(currentFrameNumberState)
    const [isDrawerOpened, setIsDrawerOpened] = useState(true)
    const [marks, setMarks] = useState<Mark[]>([])
    const [device, setDevice] = useState<any | undefined>(undefined)
    const inputRef = useRef<HTMLInputElement>(null)    

    const startStop = () => {
        if(!isRunning) {            
            if(currentAppMode === "Station") {
                start(device)
            }
            else {
                start()
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

    const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null) {                     
            const text = await e.target.files[0].text()
            const frames: DataFrame[] = JSON.parse(text)
            setFlightData({
                frames, messageFrames: []
            })
            setCurrentFrameNumber(0)
            setMarks(frames.map( (fr, index) => ({value: index}) ))
        }
    }

    const clickInput = () => {
        if(inputRef.current !== null) {
            inputRef.current.click()
        }
    }

    return(
        <AppBar className="TopBar" position="static" >
            <Toolbar variant="dense">
                <IconButton onClick={() => setIsDrawerOpened(true)} className="menuButton">
                    <img src={menuIcon} className="menuIcon" alt="menu" />
                </IconButton>                

                {currentAppMode === "Player" &&
                    <>
                        {flightData.frames.length !== 0 &&
                            <>
                                { flightData.getTime(0).toFixed(1) }
                                <Slider 
                                    value={currentFrameNumber >= 0? flightData.getTime(currentFrameNumber) : flightData.getTime(0)}
                                    min={0}
                                    max={flightData.frames.length - 1}
                                    step={null}
                                    marks={marks}             
                                    onChange={(e,v: any) => setCurrentFrameNumber(v)}
                                />
                                { flightData.getTime(flightData.frames.length - 1).toFixed(1) }
                            </>
                        }
                        <IconButton onClick={clickInput}>
                            <img src={publishIcon} alt="Pick file" />
                        </IconButton>
                        <input ref={inputRef} onChange={pickFile} type='file' hidden/>
                    </>

                }

                {flightData.frames.length !== 0 && currentAppMode !== "Player" &&
                    <IconButton onClick={saveJSON}>
                        <img src={saveIcon} alt="play/pause" />
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

                <UtilitiesOpener addUtility={addUtility} />

                <Button
                    variant="contained"
                    size="medium"
                    className="Button"
                    onClick={startStop}
                    disabled={(currentAppMode === "Station" && device === undefined) || (currentAppMode === "Player" && flightData.frames.length === 0)}
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