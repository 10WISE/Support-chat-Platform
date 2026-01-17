import * as React from 'react';
import { useState, useEffect } from 'react';
import http from 'mixins/https';
import alerts from 'mixins/messages';
import { useSelector } from 'slices';
import * as _ from 'lodash';
import ScaleForm from '../forms/ScaleForm';
import { ValidatorForm } from 'react-material-ui-form-validator';
import {
  DialogTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Swal from 'sweetalert2';

interface ScaleDialogProps {
  open: any;
  setOpenModal: any;
}

interface DataScaleProps {
  typeUser: string;
  idUser: string;
  nameUser: string;
  reason: string;
  idUserCreate: string;
  idTicket: string;
}

declare const window: any;

const ScaleDialog = (props: ScaleDialogProps) => {
  const { open, setOpenModal } = props;
  const { ticketSelected, loggedUser, tickets } = useSelector(
    (state) => state.app,
  );

  const objData = {
    typeUser: '1',
    idUser: '',
    nameUser: '',
    reason: '',
    idUserCreate: loggedUser.userInfo.idUser,
    idTicket: ticketSelected.idTicket,
  };
  const [dataScale, setDataScale] = useState<DataScaleProps>(objData);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    window.createLoadingHADS();
    try {
      alerts.Ok(
        'Buen trabajo',
        `Ticket <strong>${dataScale.idTicket}</strong> escalado correctamente.`,
      );
      window.removeLoadingHADS();
      setOpenModal(false);
    } catch (error) {
      Swal.fire({
        title: 'Atencion!',
        text: `Error al escalar el soporte: ${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        backdrop: false,
        allowOutsideClick: false,
      });
      window.removeLoadingHADS();
      setOpenModal(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ValidatorForm onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">{`Escalar Ticket ${ticketSelected.idTicket}`}</DialogTitle>
          <DialogContent>
            <ScaleForm dataScale={dataScale} setDataScale={setDataScale} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Escalar
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
};

export default ScaleDialog;
