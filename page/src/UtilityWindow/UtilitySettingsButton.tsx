import { IconButton } from "@material-ui/core"
import React, { FC } from "react"
import settingsIcon from "./settingsIcon.svg"

interface props {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const UtilitySettingsButton: FC<props> = ({onClick}) => (
    <IconButton onClick={onClick} size="small" className="UtilitySettingsButton">
        <img src={settingsIcon} alt="settingsIcon"/>
    </IconButton>
)