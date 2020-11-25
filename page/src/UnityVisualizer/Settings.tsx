import "./Settings.scss"
import React, { useState } from "react"
import { CameraModes } from "./UnityVisualiser"
import { SettingsButton } from "./SettingsButton"

/*interface props {
    setMode: (parameter: CameraModes) => void,
    setIsMarkEnabled: React.Dispatch<React.SetStateAction<boolean>>,
    isMarkEnabled: boolean,    
    setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>,
    isFullscreen: boolean
}

export const Settings: React.FC<props> = ({setMode, setIsMarkEnabled, isMarkEnabled, setIsFullscreen, isFullscreen}) => {    
    const [isActive, setIsActive] = useState(false)

    return(
        <div className="Settings">
            <button onClick={() => setIsActive(!isActive)} />
            {isActive && (
                <div className="settingsList">                
                    <button onClick={() => setMode(CameraModes.Orbit) }> Orbit </button>
                    <button onClick={() => setMode(CameraModes.Side) }> Side </button>
                    <button onClick={() => setMode(CameraModes.Top) }> Top </button>
                    <SettingsButton>
                        Camera modes
                    </SettingsButton>
                    <SettingsButton>
                        Display marker
                        <OrangeSwitch
                            onChange={() => setIsMarkEnabled(!isMarkEnabled)}
                            checked={isMarkEnabled}
                        />                        
                    </SettingsButton>    
                    <SettingsButton>
                        Fullscreen
                        <OrangeSwitch
                            onChange={() => setIsFullscreen(!isFullscreen)}
                            checked={isFullscreen}
                        />                        
                    </SettingsButton> 
                </div>
            )}
        </div>
    )
}*/