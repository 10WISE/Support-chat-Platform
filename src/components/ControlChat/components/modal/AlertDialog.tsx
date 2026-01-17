import * as React from 'react';
import { useState, useEffect } from 'react';
import ProgressCircular from '../../../../utils/ProgressCircular';
import {
  DialogTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface ScaleDialogProps {
  open: any;
  setOpenModal: any;
  title: any;
  message: any;
}

const ScaleDialog = (props: ScaleDialogProps) => {
  const { open, setOpenModal } = props;
  const [Progress, setProgress] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      {/* <ListItemText primary="Escalar" onClick={handleClickOpen} /> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ProgressCircular open={Progress} setOpen={setProgress} />
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScaleDialog;
