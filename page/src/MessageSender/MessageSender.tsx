import { Button } from "@material-ui/core"
import React, { FC, useMemo } from "react"
import { useGlobalState } from "../globalState"
import { SettingsOption, UtilityWindow } from "../UtilityWindow/UtilityWindow"
import { currentAppModeState, isRunningState } from ".."

interface props {
    removeUtility: () => void
    bigWindow: boolean
}



export const MessageSender: FC<props> = ({removeUtility, bigWindow}) => {
    const [isRunning] = useGlobalState(isRunningState)
    const [currentAppMode] = useGlobalState(currentAppModeState)

    //const handleEmergency = 

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
                    newWindow.defaultUtilities = ["Message sender"]
                }
                removeUtility()
            }
        }
    ], [])

    const isDisabled = currentAppMode === "Station" && isRunning

    return(
        <UtilityWindow settingsOptions={settingsOptions} bigWindow={bigWindow}>
            <Button disabled={isDisabled}> Send emergency message </Button>
        </UtilityWindow>
    )

}