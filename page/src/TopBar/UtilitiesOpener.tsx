import { IconButton, Menu, MenuItem } from "@material-ui/core"
import React, { FC, useMemo, useRef, useState } from "react"
import { Utilities, Utility } from ".."
import dropDownIcon from "./dropDownIcon.svg"

interface props {
    addUtility: (u: Utility) => void
}

export const UtilitiesOpener: FC<props> = ({addUtility}) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const [isMenuOpened, setIsMenuOpened] = useState(false)
    const menuButtons = useMemo(() => Utilities.map((utilityName, index) => 
        <MenuItem
            key={index}
            onClick={() => {addUtility(utilityName); setIsMenuOpened(false)}}
        >
            { utilityName }
        </MenuItem>
    ), [addUtility])

    return(
        <>
            <IconButton ref={buttonRef} onClick={() => setIsMenuOpened(true)}>
                <img src={dropDownIcon} alt="dropDownIcon" />
            </IconButton>
            <Menu
                open={isMenuOpened}
                anchorEl={buttonRef.current}
                onClose={() => setIsMenuOpened(false)}                
            >
                { menuButtons }
            </Menu>
        </>
    )
}