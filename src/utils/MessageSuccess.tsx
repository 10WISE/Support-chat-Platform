import * as React from 'react';
import { useEffect } from 'react';
import { Snackbar, SnackbarContent, Typography, colors } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import { setMessageInformation } from 'slices/app';
import { useDispatch } from 'react-redux';

interface MessageSuccessProps {
  onClose?: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  message: string;
}

const MessageSuccess = (props: MessageSuccessProps) => {
  const { open, onClose, message } = props;
  const dispatch = useDispatch();

  const handleClose = () => {
    // onClose(false);
  };

  useEffect(() => {
    setTimeout(() => {
      let obj = {
        isVisible: false,
        message: '',
      };
      dispatch(setMessageInformation(obj));
      handleClose();
    }, 3000);
  }, [open]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoHideDuration={6000}
      // onClose={handleClose}
      open={false}
    >
      <SnackbarContent
        sx={{backgroundColor: colors.green[600],}}
        message={
          <Typography component={'span'} sx={{display: 'flex', alignItems: 'center'}}>
            <CheckCircleIcon sx={{marginRight:2}} />
            {message}
          </Typography>
        }
        variant="elevation"
      />
    </Snackbar>
  );
};

export default MessageSuccess;
