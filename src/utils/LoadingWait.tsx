import * as React from 'react';
import { Backdrop, CircularProgress, Button } from '@mui/material';
import { useSelector } from 'slices';


export default function LoadingWait() {
  const { loadingWait } = useSelector((state) => state.app);

  React.useEffect(() => {}, [loadingWait]);

  return (
    <>
      <Backdrop 
      sx={{
        zIndex: 'drawer + 2000',
        color: '#fff'}} 
        open={loadingWait}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
