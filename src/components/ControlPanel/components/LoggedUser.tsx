import * as React from 'react';
import {
    Typography,
    Theme
  } from '@mui/material';


interface LoggedUserProps {
    name: string;
    lastname: string;
}

export const LoggedUser = (props: LoggedUserProps) => {

    return (
        <Typography        
        color="textPrimary"
        variant="h5"
      >
        {props.name}
      </Typography>
    );
};