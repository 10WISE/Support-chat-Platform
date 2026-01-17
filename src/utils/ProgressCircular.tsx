import * as React from 'react';
import { Backdrop, CircularProgress, Button } from '@mui/material';

interface ProgressCircularProps {
  open: any;
  setOpen?: any;
}

export default function ProgressCircular(props: ProgressCircularProps) {
  const { open, setOpen } = props;
  return (
    <div>
      <Backdrop sx={{zIndex: 'drawer + 1', color: '#fff'}} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
