import "./UnityVisualizer.scss"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import Unity, { UnityContent } from "react-unity-webgl"
import { context } from "../App/App"
import { Vector } from "../usefullStuff"
import { Settings } from "./Settings"
import { AppModes } from "../MainComponent/MainComponent"

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

export default () => {
    const {
        originalHeight,
        flightProperties,
        originalLatitude,
        originalLongitude,
        appMode
    } = useContext(context)

    const UnityVisualiserRef = useRef<HTMLDivElement>()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isUnityLoaded, setIsUnityLoaded] = useState(false)
    const [isMarkEnabled, setIsMarkEnabled] = useState(true)    
    const unityContent = useMemo(() => new UnityContent("unity/Build/unity.json", "unity/Build/UnityLoader.js"), [])
    const canSatPosition = flightProperties.last() === undefined? 
        {x: 0, y: 0, z: 0}
        :
        flightProperties.last().canSatPosition
    
    unityContent.on("loaded", () => setIsUnityLoaded(true))

    const setMode = useCallback( cerateUnityFunction <CameraModes> (unityContent, "Main Camera", "setMode"), [unityContent] )    
    const setOriginalHeightUnity = useCallback( cerateUnityFunction <number> (unityContent, "Main Camera", "setOriginalHeight"), [unityContent] )
    const moveCanSat = useCallback( cerateUnityFunction <Vector> (unityContent, "CanSat", "moveCanSat", true), [unityContent] )
    const setMarkEnabled = useCallback( cerateUnityFunction <boolean> (unityContent, "CanSat2d", "setMarkEnabled", true), [unityContent] )
    const setCoordinates = useCallback( cerateUnityFunction <Coordinates> (unityContent, "Map", "setCoordinates", true), [unityContent] )
    
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
        if(UnityVisualiserRef === undefined) return
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
    })
            

    return(
        <div className="UnityVisualiser" ref={UnityVisualiserRef}>                                    
            <Settings
                setMode={setMode}
                setIsMarkEnabled={setIsMarkEnabled}
                isMarkEnabled={isMarkEnabled}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
            />
            <Unity unityContent={unityContent} className="viewport"/>
        </div>
    )
}