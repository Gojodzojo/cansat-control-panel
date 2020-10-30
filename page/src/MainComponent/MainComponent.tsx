import "./MainComponent.scss"
import React, { useContext } from 'react'
import { SetData } from './SetData'
import { WatchData } from './WatchData'
import { context } from "../App/App"

export enum AppModes {
    SetData,
    WatchData
}

export default () => {
    const {appMode} = useContext(context)
    let component: JSX.Element

    switch (appMode) {
        case AppModes.SetData:
            component = <SetData />
            break
        case AppModes.WatchData:
            component = <WatchData />
            break
        default:
            component = <h1> MainComponent error </h1>
            break
    }

    return(
        <div className="MainComponent">
            { component }
        </div>
    )
}