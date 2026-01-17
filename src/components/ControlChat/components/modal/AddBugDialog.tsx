import * as React from 'react';
import { useState } from 'react';
import AddBugForm from '../forms/AddBugForm';
import axios from 'axios';
import { useSelector } from 'slices';
import { addBug } from 'slices/app';
import * as _ from 'lodash';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { ValidatorForm } from 'react-material-ui-form-validator';
import ProgressCircular from 'utils/ProgressCircular';
import { InjectBugDevops } from 'utils/HADSObjectsLocal';
import './style.css';

import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  Theme,
} from '@mui/material';

interface AddBugDialogProps {
  open: boolean;
  setOpenModalAddBug: React.Dispatch<React.SetStateAction<boolean>>;
}

declare const conn_HUB_URL: any;

const AddBugDialog = (props: AddBugDialogProps) => {
  const { open, setOpenModalAddBug } = props;
  const [dataAdd, setDataAdd] = useState(null);
  const dispatch = useDispatch();
  const [Progress, setProgress] = useState(false);

  const [dataAddBug, setDataAddBug] = useState<InjectBugDevops>(null);

  const { ticketSelected, loggedUser, tickets } = useSelector(
    (state) => state.app
  );

  React.useEffect(() => {
    setDataAddBug({
      ...dataAddBug,
      idSupport: ticketSelected.idTicket,
      idConversation: ticketSelected.conversation.idConversation,
      userInfo: loggedUser.userInfo,
      title: '',
      label: '',
      description: '',
      step: '',
      idProject: ticketSelected.idProject,
      files: [],
    });
  }, []);

  const handleClose = () => {
    setOpenModalAddBug(false);
  };

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    setProgress(true);

    try {
      let url = 'api/bug/inject';
      axios
        .post(url, dataAddBug)
        .then((res) => {
          if ('1' == res.data.code) {
            setProgress(false);
            dispatch(addBug(res.data.data));

            Swal.fire({
              title: 'Buen trabajo!',
              html: res.data.message,
              icon: 'success',
              backdrop: false,
              allowOutsideClick: false,
              confirmButtonText: 'Aceptar',
              reverseButtons: true,
            }).then((result: any) => {
              if (result.isConfirmed) {
                setOpenModalAddBug(false);
              }
            });
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.response.data.ExceptionMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            backdrop: false
          });
        });
    } catch (error) {}
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ValidatorForm onSubmit={handleSubmit}>
          <ProgressCircular open={Progress} setOpen={setProgress} />
          <DialogTitle id="alert-dialog-title">
            {`Agregar Bug al Tk ${ticketSelected.idTicket} ${ticketSelected.projectName}`}
          </DialogTitle>
          <DialogContent sx={{overflowY: 'scroll', maxHeight: '400px', minHeight: '150px',}}>
            <AddBugForm dataAddBug={dataAddBug} setDataAddBug={setDataAddBug} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Inyectar Bug
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
};

export default AddBugDialog;
