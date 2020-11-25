import { Button, Menu, MenuItem } from "@material-ui/core"
import React, { FC, useRef, useState } from "react"
import { Property, Properties } from "./Graph"

interface props {
    value: Property,
    setValue: React.Dispatch<React.SetStateAction<Property>>
}

export const PropertySelect: FC<props> = ({value, setValue}) => {
    const ButtonRef = useRef<HTMLButtonElement | null>(null)
    const [isOpened, setIsOpened] = useState(false)

    return(
        <div>
            <Button ref={ButtonRef}> { value } </Button>
            <Menu anchorEl={ButtonRef.current} open={isOpened} onClose={() => setIsOpened(false)}>
                {
                    Properties.map((property: Property) => (
                        <MenuItem onClick={() => setValue(property)}>
                            { property }
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    )
}