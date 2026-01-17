import * as React from 'react';
import { useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import { Box } from '@mui/material';
import { setMessageInformation } from 'slices/app';
import { useDispatch } from 'react-redux';
import { useSelector } from 'slices';


export interface State extends SnackbarOrigin {
  open: boolean;
}

const AlertMessage = () => {
  const dispatch = useDispatch();
  const { messageInformation } = useSelector((state) => state.app);

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal } = state;

  useEffect(() => {
    setTimeout(() => {
      let obj = {
        isVisible: false,
        message: '',
        type: '',
      };
      dispatch(setMessageInformation(obj));
    }, 6000);
  }, [messageInformation.isVisible]);

  return (
    <Box sx={{
        width: '100%',
        '& > * + *': {
          marginTop: 2,
        },
      }}>
      {messageInformation.message && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={messageInformation.isVisible}
          autoHideDuration={6000}
        >
          <Alert
            elevation={6}
            severity={
              messageInformation.type == 'success' ||
              messageInformation.type == undefined
                ? 'success'
                : 'error'
            }
          >
            {messageInformation.message.split('<br>').map((i, key) => {
              if (i != '') {
                return <div key={key}>{i}</div>;
              }
            })}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AlertMessage;
