import "./UnityVisualizer.scss"
import React, { useCallback, useContext, useEffect, useMemo } from "react"
import Unity, { UnityContent } from "react-unity-webgl"
import { context } from "../App/App"
import { Modes } from "../MainComponent/MainComponent"

export function cerateUnityFunction <paramType> (unityContent: UnityContent, gameObjectName: string, methodName: string) {
    return function (parameter: paramType) {
        unityContent.send(gameObjectName, methodName, parameter)
    }
}

enum CameraModes {
    Orbit,
    Top,
    Side
}

export default () => {
    const {originalHeight, canSatPosition, setCanSatPosition} = useContext(context)

    const unityContent = useMemo(() => new UnityContent("unity/Build/unity.json", "unity/Build/UnityLoader.js"), [])
    const setMode = useCallback( cerateUnityFunction <CameraModes> (unityContent, "Main Camera", "setMode"), [unityContent] )    
    const setOriginalHeightUnity = useCallback( cerateUnityFunction <number> (unityContent, "Main Camera", "setOriginalHeight"), [unityContent] )
    const moveCanSat = useCallback( cerateUnityFunction <string> (unityContent, "Sphere", "moveCanSat"), [unityContent] )
    
    useEffect(() => setOriginalHeightUnity(originalHeight), [originalHeight])    
    useEffect(() => moveCanSat(JSON.stringify(canSatPosition.last())), [canSatPosition])    

    return(
        <div className="UnityVisualiser">            
            <div id="onCanvas">
                <button onClick={() => setMode(CameraModes.Orbit) }> Orbita </button>
                <button onClick={() => setMode(CameraModes.Side) }> Bok </button>
                <button onClick={() => setMode(CameraModes.Top) }> Góra </button> 
            </div>
            <Unity unityContent={unityContent} className="viewport"/>     
        </div>
    )
}