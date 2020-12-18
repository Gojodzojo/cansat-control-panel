import "./UnityVisualizer.scss"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Unity, { UnityContent } from "react-unity-webgl"
import { Vector } from "../usefullStuff"
import { useGlobalState } from "../globalState"
import { currentAppModeState, currentFrameNumberState, flightDataState, isRunningState } from ".."
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"

const CAMERA_MODES = [
    {
        name: "Orbit",
        number: 0
    },
    {
        name: "Top",
        number: 1
    },
    {
        name: "Side",
        number: 2
    }
] as const    

interface Coordinates {
    x: number,
    y: number
}

function cerateUnityFunction <paramType> (unityContent: UnityContent, gameObjectName: string, methodName: string, stringify = false) {
    return function (parameter: paramType) {
        unityContent.send(gameObjectName, methodName, stringify? JSON.stringify(parameter) : parameter)
    }
}

interface props {
    removeUtility: () => void
    bigWindow: boolean
}

export const UnityVisualiser: FC<props> = ({removeUtility, bigWindow}) => {    
    const [flightData] = useGlobalState(flightDataState)
    const [currentAppMode] = useGlobalState(currentAppModeState)
    const [currentFrameNumber] = useGlobalState(currentFrameNumberState)
    const [isRunning] = useGlobalState(isRunningState)
    const UnityVisualiserRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isMarkEnabled, setIsMarkEnabled] = useState(true)

    const unityContent = useMemo(() => new UnityContent("unity/Build/unity.json", "unity/Build/UnityLoader.js"), [])
    const [isUnityLoaded, setIsUnityLoaded] = useState(false)
    unityContent.on("loaded", () => setIsUnityLoaded(true))    

    const setMode = useCallback( cerateUnityFunction <number> (unityContent, "Main Camera", "setMode"), [unityContent] )    
    const setOriginalHeightUnity = useCallback( cerateUnityFunction <number> (unityContent, "Main Camera", "setOriginalHeight"), [unityContent] )
    const moveCanSat = useCallback( cerateUnityFunction <Vector> (unityContent, "CanSat", "moveCanSat", true), [unityContent] )
    const setMarkEnabled = useCallback( cerateUnityFunction <boolean> (unityContent, "CanSat2d", "setMarkEnabled", true), [unityContent] )
    const setCoordinates = useCallback( cerateUnityFunction <Coordinates> (unityContent, "Map", "setCoordinates", true), [unityContent] )

    useEffect(() => {
        if(isUnityLoaded) {
            if(currentAppMode === "Simulator" && "frameRate" in flightData && !isRunning) {
                const { initialHeight, initialLatitude, initialLongitude } = flightData
                setOriginalHeightUnity(initialHeight + 1)
                setCoordinates({x: initialLatitude, y: initialLongitude})
                moveCanSat({x: 0, y: initialHeight, z: 0})
            }
            else if(currentFrameNumber !== undefined && currentFrameNumber > 0) {
                moveCanSat( flightData.getPosition(currentFrameNumber) )
            }
        }
    }, [flightData, currentAppMode, currentFrameNumber, isUnityLoaded])

    useEffect(() => {
        const handleFullscreenChange = () => {
            if(document.fullscreenElement === null) {                
                setIsFullscreen(false)
            } 
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
    })

    useEffect(() => {
        if(UnityVisualiserRef.current === null) return
        if(isFullscreen) {
            UnityVisualiserRef.current.requestFullscreen().catch(err => console.log(err))
        }
        else {
            document.exitFullscreen().catch(err => console.log(err))
        }
    }, [isFullscreen])

    useEffect(() => setMarkEnabled(isMarkEnabled), [isMarkEnabled, isUnityLoaded])

    const settingsOptions: SettingsOption[] = useMemo(() => [
        {
            title: "Remove window",
            action: removeUtility        
        },
        {
            title: "Open in new window",
            action: () => {
                const newWindow = window.open("./", "_blank")
                if(newWindow) {
                    newWindow.defaultUtilities = ["Visualizer"]
                }
                removeUtility()
            }
        },
        {
            title: `Turn ${isFullscreen? "off" : "on"} fullscreen`,
            action: () => setIsFullscreen(!isFullscreen)
        },
        {
            title: `Turn ${isMarkEnabled? "off" : "on"} marker`,
            action: () => setIsMarkEnabled(!isMarkEnabled)
        },
        {
            title: "Camera modes",
            subOptions: CAMERA_MODES.map(({name, number}): SettingsOption => ({
                title: name,
                action: () => setMode(number)
            }))            
        }
    ], [isFullscreen, isMarkEnabled])
        
    return(
        <UtilityWindow
            settingsOptions={settingsOptions}
            bigWindow={(bigWindow || isFullscreen)}
            ref={UnityVisualiserRef}
            container={(UnityVisualiserRef.current !== null)? UnityVisualiserRef.current : undefined}
        >
            <Unity unityContent={unityContent} />
        </UtilityWindow>
    )
    
}