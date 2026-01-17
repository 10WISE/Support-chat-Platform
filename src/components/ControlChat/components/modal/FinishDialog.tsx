import * as React from 'react';
import { useState, useEffect } from 'react';
import FinishForm from '../forms/FinishForm';
import _axios from 'api/AxiosConfig';
import http from 'mixins/https';
import { useSelector } from 'slices';
import { setLoadingWait } from 'slices/app';
import * as _ from 'lodash';
import { useDispatch } from 'react-redux';
import alerts from 'mixins/messages';
import { ValidatorForm } from 'react-material-ui-form-validator';
import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';

interface FinishDialogProps {
  open: boolean;
  setOpenModalFinish: React.Dispatch<React.SetStateAction<boolean>>;
}

interface selectObject {
  id: string;
  name: string;
}

interface DataFinishProps {
  typeSupport: string;
  subTypeSupport: string;
  specificationSupport: string;
  descriptionSolution: string;
  idExtra: string;
}

declare const window: any;

const FinishDialog = (props: FinishDialogProps) => {
  const { open, setOpenModalFinish } = props;
  const dispatch = useDispatch();

  let obj = {
    typeSupport: '',
    subTypeSupport: '',
    specificationSupport: '',
    descriptionSolution: '',
    idExtra: '',
  };

  const [dataFinish, setDataFinish] = useState<DataFinishProps>(obj);
  const [dataTypes, setDataTypes] = useState<selectObject[]>([]);
  const [hasBug, setHasBug] = useState(false);

  const { ticketSelected, loggedUser, tickets } = useSelector(
    (state) => state.app,
  );

  const handleClose = () => {
    setOpenModalFinish(false);
  };

  const handleSubmit = async (event: React.FormEvent<Element>) => {
    event.preventDefault();
    window.createLoadingHADS();

    try {
      alerts.Ok(
        'Buen trabajo',
        `Ticket <strong>${ticketSelected.idTicket}</strong> finalizado correctamente.`,
      );
      setOpenModalFinish(false);
      window.removeLoadingHADS();
    } catch (error) {
      window.removeLoadingHADS();
    }
  };

  useEffect(() => {
    dispatch(setLoadingWait(true));
    const fetchData = async () => {
      try {
        const { data } = await http.GetHADS(`automatic_typing/get`, {
          idConversation: ticketSelected.conversation.idConversation,
          idProject: ticketSelected.idProject,
          idTicket: ticketSelected?.idTicket,
        });
        setDataTypes(data.types);
        if (typeof data.automatic_typing === 'object') {
          console.log(data.automatic_typing);
          setDataFinish({
            ...dataFinish,
            ['typeSupport']: data.automatic_typing.type,
            ['subTypeSupport']: data.automatic_typing.subType,
            ['specificationSupport']: data.automatic_typing.specification,
          });
        }
        dispatch(setLoadingWait(false));
      } catch (error) {
        dispatch(setLoadingWait(false));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    ticketSelected.idBug.length > 1 && setHasBug(true);
  }, []);

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ValidatorForm onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title" style={{ paddingBottom: '0px' }}>
            {`Finalizar Ticket ${ticketSelected?.idTicket}`}
          </DialogTitle>
          {hasBug && (
            <Typography style={{ paddingLeft: '24px' }}>
              {`Se notificará la finalización del ticket en el Bug ${ticketSelected?.idBug}`}
            </Typography>
          )}
          <DialogContent>
            <FinishForm
              dataFinish={dataFinish}
              setDataFinish={setDataFinish}
              dataTypes={dataTypes}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Finalizar
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
};

export default FinishDialog;
