import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'slices';
import http from 'mixins/https';

import AlertDialog from '../ControlChat/components/modal/AlertDialog';

import {Box, Theme} from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Button, IconButton, Tooltip } from '@mui/material';

import { store } from 'index';
import { setIsConnected } from 'slices/connectHub';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

import {
  setLoadingWait,
  setTicketSelected,
  setMeetingSelected,
} from 'slices/app';
import { useDispatch } from 'react-redux';


export default function CustomizedSwitches() {
  const [state, setState] = React.useState({
    checkedC: false,
  });
  const [stateLogin, setStateLogin] = React.useState({
    checkedC: false,
  });

  const dispatch = useDispatch();

  const { loggedUser, ticketSelected } = useSelector((state) => state.app);
  const isConnected = useSelector((state) => state.connectHub.isConnected);
  const [openModalAlert, setOpenModalAlert] = useState(false);

  let background = '';

  if (!isConnected) {
    background = 'orange';
  } else if (state.checkedC == true) {
    background = '#209B23';
  } else {
    background = '#9B2020';
  }

  useEffect(() => {
    if (isConnected) {
      if (loggedUser.userInfo.idUser == undefined) {
        store.dispatch(setIsConnected(false));
      } else {
        window.onbeforeunload = (res: any) => {
          alert('desmotado ventana');
        };
      }
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [isConnected]);

  const PauseSupport = async () => {
    try {
      var isAsignador = parseInt(ticketSelected?.isAsignador);
      if (isAsignador > 0) {
        dispatch(setLoadingWait(true));
        let obj = {
          InOrdenTrabajoTipo: ticketSelected.idProjectAllocator,
          InOrdenTrabajoIdProy: ticketSelected.idTicket,
          InUsuarioCedula: loggedUser.userInfo.documentId,
        };
        await http.PostConnect(`AsignadorUniversal/Pausar`, obj);
        dispatch(setTicketSelected(undefined));
        dispatch(setMeetingSelected(''));
        dispatch(setLoadingWait(false));
      } else {
        dispatch(setTicketSelected(undefined));
        dispatch(setMeetingSelected(''));
        dispatch(setLoadingWait(false));
      }
      var divPause = document.getElementById('PauseDiv');
      divPause.style.backgroundColor = '#ed324c';
      var textPause = document.getElementById('textPause');
      textPause.innerHTML = 'En Pausa';
    } catch (error) {
      console.error(error);
      dispatch(setLoadingWait(false));
    }
    dispatch(setLoadingWait(false));
  };

  const KeyPress = (e: any) => {
    if (e.keyCode == 73 && e.ctrlKey) {
      PauseSupport();
    }
  };
  document.onkeydown = KeyPress;

  return (
    <Box sx={{
      display: 'flex',
      margin: '0 !important',
      textAlign: 'center',
      width: '100% !important'
      }}>
      {/*Boton oculto para ejecutar desde la consola y lograr desconectar SignalR ==> document.getElementById('btn_6453').click()*/}
      <Button
        hidden={true}
        id={'btn_6453'}
        onClick={(e: any) => {
          store.dispatch(setIsConnected(false));
        }}
        color="primary"
      >
        Off
      </Button>
      <Box sx={{
        textAlign: 'center',
        padding: 'auto',
        margin: '0 !important',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '&:not(:last-of-type)': {
          borderRight: `1px solid palette.divider`
        }
        }} key={0}>
        <FormGroup sx={{margin: 'auto !important', textAlign: 'center'}}>
          {/* <Typography align="center" component="h6" variant="subtitle1"> */}
            <Grid component="label" container alignItems="center" spacing={1}>
              <Tooltip title="Pausar atención de soporte">
                <IconButton
                  aria-label="Pausar atención de soporte"
                  onClick={() => {
                    dispatch(setLoadingWait(true));
                    PauseSupport();
                  }}
                >
                  <Typography id={'textPause'}>Pausar Soporte</Typography>
                  <PauseCircleFilledIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
              {/* <Grid item>OFF</Grid>
              <Grid item>
                <AntSwitch
                  checked={state.checkedC}
                  onChange={handleChange}
                  name="checkedC"
                />
              </Grid>
              <Grid item>ON</Grid> */}
            </Grid>
          {/* </Typography> */}
        </FormGroup>
      </Box>
      {/* <div
        className={classes.statsItem}
        style={{
          background: background,
          color: '#fff',
          fontWeight: 'bolder',
          borderRadius: '0px 3px 3px 0px',
        }}
        key={1}
      >
        {isConnected
          ? state.checkedC == true
            ? 'Disponible'
            : 'No disponible'
          : 'Desconectado'}
      </div> */}
      <AlertDialog
        open={openModalAlert}
        setOpenModal={setOpenModalAlert}
        title={'Usuario Desconectado'}
        message={
          'No es posible encender la disponibilidad de atención debido a que se ha detectado que la cuenta actual logueado ha sido desconectada, por favor recargue la pagina o inicie sesión nuevamente.'
        }
      />
      {/* {loggedUser && (
        <MotiveDisconnection
          open={openModalMotive}
          setOpenModal={setOpenModalMotive}
          signed={signed}
          callback={callbackForm}
        />
      )} */}
    </Box>
  );
}
