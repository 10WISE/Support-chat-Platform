import * as React from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';
import {Box, Theme, Typography} from '@mui/material';
import { Button } from '@mui/material';
import * as _ from 'lodash';
import { AlertColor } from '@mui/lab/Alert';

const Alerta = (props: AlertProps) => {
  return <Alert elevation={6} variant="filled" {...props} />;
};

interface CustomizedSnackbarsProps {
  data: {
    idTicket: string;
    projectName: string;
    message: string;
    color: AlertColor;
  };
  clickHandler: any;
}

const CustomizedSnackbars = (props: CustomizedSnackbarsProps) => {
  const { data, clickHandler } = props;

  return (
    <Box sx={{
      width: '100%',
      '& > * + *': {
      marginTop: 0.5,
    }}}>
      <Alerta
        action={
          <Button color="primary" size="small" onClick={clickHandler}>
            Atender
          </Button>
        }
        severity={data.color}
      >
        <Typography component={'span'} sx={{fontSize: '19px'}}>Tk {data.idTicket}</Typography>{' '}
        {data.projectName} {data.message}
      </Alerta>
    </Box>
  );
};

export default CustomizedSnackbars;
