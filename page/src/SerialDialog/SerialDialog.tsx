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
            Aplication can not use the ground station mode because 
          </DialogContentText>
        </DialogContent>
    </Dialog>
)