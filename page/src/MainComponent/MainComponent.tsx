import React, { useState } from 'react'
import { SetData } from './SetData'
import { WatchData } from './WatchData'

export enum Modes {
    SetData,
    WatchData
}

export default () => {
    const [mode, setMode] = useState(Modes.SetData)

    switch (mode) {
        case Modes.SetData:
            return <SetData setMode={setMode} />
        case Modes.WatchData:
            return <WatchData setMode={setMode} />
        default:
            return <h1> MainComponent error </h1>
    }
}