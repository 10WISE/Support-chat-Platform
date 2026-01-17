import * as React from 'react';
import { useState } from 'react';
import MuiDialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { grey } from '@mui/material/colors';

interface ViewImagesProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
}


export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = ((props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle component={"span"} sx={{maxWidth: 345}} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 1,
            top: 1,
            color: grey[500],
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ViewImages = (props: ViewImagesProps) => {
  const { open, setOpenModal, url } = props;
  const [widthImage, setWidthImage] = useState<
    false | 'xl' | 'xs' | 'sm' | 'md' | 'lg'
  >();

  const handleClose = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    let imageMessage = new Image();
    imageMessage.src = url;
    imageMessage.onload = () => {
      setWidthImage('xs');
      if (imageMessage.width > 500 && imageMessage.width <= 800) {
        setWidthImage('md');
      } else if (imageMessage.width > 800 && imageMessage.width <= 100) {
        setWidthImage('lg');
      } else if (imageMessage.width > 1000) {
        setWidthImage('xl');
      }
    };
  }, []);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={widthImage}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {' '}
          </DialogTitle>
          <DialogContentText id="alert-dialog-description">
            <img src={url} width={'100%'} height={'100%'} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Descargar imagen">
            <IconButton
              aria-label="Descargar"
              onClick={() => {
                window.open(url, 'Download');
              }}
              style={{ backgroundColor: '#3BCA4D' }}
            >
              <Typography>Descargar</Typography>
              <ArrowDownwardIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewImages;
