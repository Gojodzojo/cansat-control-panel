import "./UnityVisualizer.scss"
import React, { useCallback, useMemo } from "react"
import Unity, { UnityContent } from "react-unity-webgl"

export function cerateUnityFunction <paramType> (unityContent: UnityContent, gameObjectName: string, methodName: string) {
    return function (parameter: paramType) {
        unityContent.send(gameObjectName, methodName, parameter)
    }
}

enum Modes {
    Orbit = 0,
    Top = 1,
    Side = 2
}

export default () => {
    // <button onClick={() => unityContent.send("Sphere", "moveCanSat", '{"x": 0, "y": 0, "z": 0}') } />
    const unityContent = useMemo(() => new UnityContent("unity/Build/unity.json", "unity/Build/UnityLoader.js"), [])
    const setMode = useCallback( cerateUnityFunction <Modes> (unityContent, "Main Camera", "setMode"), [unityContent] )

    return(
        <div className="UnityVisualiser">
            <div id="onCanvas">
                <button onClick={() => setMode(Modes.Orbit) }> Orbita </button>
                <button onClick={() => setMode(Modes.Side) }> Bok </button>
                <button onClick={() => setMode(Modes.Top) }> Góra </button> 
            </div>
            <Unity unityContent={unityContent} className="viewport"/>            
        </div>
    )
}