import "./Switch.scss"
import React, { useMemo } from 'react'

interface props {
    switchHeight: string | number,
    ballHeight: string | number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    animationDuration: string,
    checkedColor: string,
    defaultChecked?: boolean,
    checked?: boolean
}

const ID = () => Math.random().toString(36).substr(2, 9)

export const Switch = React.forwardRef<HTMLInputElement, props>(({switchHeight, ballHeight, onChange, animationDuration, checkedColor, defaultChecked, checked}, ref) => {
    const switchId = useMemo(() => `Switch-${ID()}`, [])
    return(
        <>
            <style>{
                `#${switchId} {
                    --switch-height: ${switchHeight};
                    --ball-height: ${ballHeight};
                    --ball-gap: calc( (var(--switch-height) - var(--ball-height)) / 2);
                    --animation-duration: ${animationDuration};
                    --checked-color: ${checkedColor}
                }`
            }</style>
            
            <input
                className='Switch'
                type='checkbox'
                id={switchId}
                onChange={onChange}
                defaultChecked={defaultChecked}
                ref={ref}
                checked={checked}
            />
        </>
    )
})