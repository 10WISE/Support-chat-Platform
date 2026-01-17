import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ConfirmDialogProps {
  open: boolean;
  setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  children: string;
  severity?: string;
  close?: boolean;
  textButton?: string;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    title,
    children,
    open,
    setConfirmOpen,
    onConfirm,
    onCancel,
    severity,
    close,
    textButton,
  } = props;

  return (
    <Dialog open={open} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">
        {severity == 'warning' && <WarningIcon />}
        {severity == 'success' && <CheckCircleIcon />} {title}
      </DialogTitle>
      <DialogContent>
        {children.split('<br>').map((i, key) => {
          if (i != '') {
            return <div key={key}>{i}</div>;
          }
        })}
      </DialogContent>
      <DialogActions>
        <>
          {!close && (
            <Button
              variant="contained"
              onClick={() => onCancel()}
              color="secondary"
            >
              No
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              onConfirm();
            }}
            color="success"
          >
            {textButton ? textButton : 'Si'}
          </Button>
        </>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
