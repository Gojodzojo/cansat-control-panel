import React from "react"
import { Switch } from "./Switch"

interface props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    checked?: boolean,
}

export const OrangeSwitch: React.FC<props> = ({onChange, checked = true}) => (
    <Switch
        switchHeight="15px"
        ballHeight="12px"
        animationDuration="0.25s"
        checkedColor="#fab132"
        onChange={onChange}
        checked={checked}
    />
)