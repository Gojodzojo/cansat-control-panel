import React from "react"

interface props {
    children: React.ReactNode,
    onClick?: () => void
}

export const SettingsButton: React.FC<props> = ({children, onClick}) => (
    <div className="SettingsButton" {...onClick}>
        { children }
    </div>
)