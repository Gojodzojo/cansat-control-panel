import { Menu, MenuItem, Paper } from "@material-ui/core"
import React, { useCallback, useMemo, useState, forwardRef } from "react"
import { UtilitySettingsButton } from "./UtilitySettingsButton"
import "./UtilityWindow.scss"

interface AnchorPosition {
    top: number
    left: number
}

export interface SettingsOption {
    title: string
    action?: () => void
    subOptions?: SettingsOption[]
}

interface props {
    settingsOptions: SettingsOption[]
    className?: string
    children: React.ReactNode
    bigWindow: boolean
    container?: Element
}

export const UtilityWindow = forwardRef<HTMLDivElement, props>( ({className, settingsOptions, children, bigWindow, container}, ref)  => {
    const [settingsState, setSettingsState] = useState<null | HTMLButtonElement | AnchorPosition>(null)
    const [openedSettingsOptions, setOpenedSettingsOptions] = useState<SettingsOption[]>(settingsOptions)

    const handleContext = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()        
        setSettingsState({
            left: e.clientX - 2,
            top: e.clientY - 4
        })        
    }, [setSettingsState])

    const menuProps = useMemo<object>(() => {
        if(settingsState === null) {
            return {}
        }
        else if("top" in settingsState) {
            return {
                anchorPosition: settingsState,
                anchorReference: "anchorPosition"
            }
        }
        return {
            anchorEl: settingsState,
            anchorReference: "anchorEl"
        }
    }, [settingsState]) 

    const menuContent = openedSettingsOptions.map(({action, title, subOptions}, index) => 
        <MenuItem
            onClick={() => {
                if(action !== undefined) {
                    action()
                    setOpenedSettingsOptions(settingsOptions)
                    setSettingsState(null)
                }
                else if(subOptions !== undefined) {
                    setOpenedSettingsOptions(subOptions)
                }                
            }}
            key={index}
        > { title } </MenuItem>
    )

    return(
        <Paper
            className={`
                UtilityWindow
                ${className !== undefined? className : ""}
                ${bigWindow? "big" : "small"}
            `}
            elevation={24}
            onContextMenu={handleContext}
            ref={ref}
        >
            <UtilitySettingsButton
                onClick={({currentTarget}) => setSettingsState(currentTarget)}
            />
            <Menu
                open={Boolean(settingsState)}
                {...menuProps}
                onClose={() => {setOpenedSettingsOptions(settingsOptions); setSettingsState(null)}}
                container={container}         
            > { menuContent } </Menu>
            { children }
        </Paper>
    )
})
