import "./UnityVisualizer.scss"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import Unity, { UnityContent } from "react-unity-webgl"
import { Vector } from "../usefullStuff"
import { getCanSatPosition } from "../flightProperties"
import { useGlobalState } from ".."

export enum CameraModes {
    Orbit,
    Top,
    Side
}

interface Coordinates {
    x: number,
    y: number
}

function cerateUnityFunction <paramType> (unityContent: UnityContent, gameObjectName: string, methodName: string, stringify = false) {
    return function (parameter: paramType) {
        unityContent.send(gameObjectName, methodName, stringify? JSON.stringify(parameter) : parameter)
    }
}

export const UnityVisualiser = () => {    
    /*const UnityVisualiserRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    
    const [isMarkEnabled, setIsMarkEnabled] = useState(true)        
    const canSatPosition = flightMetaData.last() === undefined? 
        {x: 0, y: 0, z: 0}
        :
        flightMetaData.last().canSatPosition    

    
    
    useEffect(() => setOriginalHeightUnity(originalHeight + 1), [originalHeight, isUnityLoaded])        
    useEffect(() => setMarkEnabled(isMarkEnabled), [isMarkEnabled, isUnityLoaded])
    useEffect(() => setCoordinates({x: originalLatitude, y: originalLongitude}), [originalLatitude, originalLongitude, isUnityLoaded])    

    useEffect(() => {
        if(appMode === AppModes.WatchData) {
            moveCanSat(canSatPosition)
        }
    }, [canSatPosition, isUnityLoaded])

    useEffect(() => {
        if(appMode === AppModes.SetData) {
            moveCanSat({x: 0, y: originalHeight, z: 0})
        }
    }, [originalHeight, isUnityLoaded])

    useEffect(() => {
        if(UnityVisualiserRef.current === null) return
        if(isFullscreen) {
            UnityVisualiserRef.current.requestFullscreen().catch(err => console.log(err))
        }
        else {
            document.exitFullscreen().catch(err => console.log(err))
        }
    }, [isFullscreen])

    useEffect(() => {
        const handleFullscreenChange = () => {
            console.log(document.fullscreenElement)
            if(document.fullscreenElement === null) {                
                setIsFullscreen(false)
            } 
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
    })*/

    const [flightMetaData] = useGlobalState("flightMetaData")
    const [currentAppMode] = useGlobalState("currentAppMode")
    const [currentFrameNumber] = useGlobalState("currentFrameNumber")
    const [isRunning] = useGlobalState("isRunning")

    const unityContent = useMemo(() => new UnityContent("unity/Build/unity.json", "unity/Build/UnityLoader.js"), [])
    const [isUnityLoaded, setIsUnityLoaded] = useState(false)
    unityContent.on("loaded", () => setIsUnityLoaded(true))

    const setMode = useCallback( cerateUnityFunction <CameraModes> (unityContent, "Main Camera", "setMode"), [unityContent] )    
    const setOriginalHeightUnity = useCallback( cerateUnityFunction <number> (unityContent, "Main Camera", "setOriginalHeight"), [unityContent] )
    const moveCanSat = useCallback( cerateUnityFunction <Vector> (unityContent, "CanSat", "moveCanSat", true), [unityContent] )
    const setMarkEnabled = useCallback( cerateUnityFunction <boolean> (unityContent, "CanSat2d", "setMarkEnabled", true), [unityContent] )
    const setCoordinates = useCallback( cerateUnityFunction <Coordinates> (unityContent, "Map", "setCoordinates", true), [unityContent] )

    useEffect(() => {
        if(isUnityLoaded) {
            if(currentAppMode === "Simulator" && "frameRate" in flightMetaData && !isRunning) {
                const { initialHeight, initialLatitude, initialLongitude } = flightMetaData
                setOriginalHeightUnity(initialHeight)
                setCoordinates({x: initialLatitude, y: initialLongitude})
                moveCanSat({x: 0, y: initialHeight, z: 0})
            }
            else if(currentFrameNumber !== undefined && currentFrameNumber > 0) {
                moveCanSat(getCanSatPosition(currentFrameNumber))
            }
        }
    }, [flightMetaData, currentAppMode, currentFrameNumber, isUnityLoaded])
        
    return(
        <Unity unityContent={unityContent} />
    )
    
}