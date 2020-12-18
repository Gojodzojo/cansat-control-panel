import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import React, { FC } from "react"

interface props {
    open: boolean
}

export const SerialDialog: FC<props> = ({open}) => (
    <Dialog open={open}>
        <DialogTitle id="alert-dialog-title"> Serial communication is turned off </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To use ground station mode you must use browser based on chromium and enable 
            experimental web platform features
            <br /> <br />            
            chrome://flags/#enable-experimental-web-platform-features
          </DialogContentText>
        </DialogContent>
    </Dialog>
)