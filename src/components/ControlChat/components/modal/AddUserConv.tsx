import * as _ from 'lodash';
import * as React from 'react';
import connHub from 'connHub';
import { useSelector } from 'slices';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setLoadingWait } from 'slices/app';
import AddUserForm from '../forms/AddUserForm';
import { ValidatorForm } from 'react-material-ui-form-validator';

import {
  DialogTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface AddUserConvProps {
  open: any;
  setOpenModal: any;
}

const AddUserConv = (props: AddUserConvProps) => {
  const { ticketSelected, loggedUser } = useSelector((state) => state.app);
  const [dataAddUser, setDataAddUser] = useState(null);
  const { open, setOpenModal } = props;
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    dispatch(setLoadingWait(true));
    try {
      let array = [];
      array.push(
        loggedUser.userInfo.idUser,
        ticketSelected.user.userInfo.idUser,
        dataAddUser.user
      );
      var obj = {
        m: ticketSelected.conversation.idConversation,
        u: array.toString(),
        d: '',
      };
      connHub.invoke('EditMeeting', obj).catch((err) => {
        console.error('se estalló', err);
      });
      dispatch(setLoadingWait(false));
      setOpenModal(false);
    } catch (error) {
      dispatch(setLoadingWait(false));
    }
  };

  useEffect(() => {
    const objData = {
      meeting: '',
      user: '',
      creator: '',
      userMod: '',
    };
    setDataAddUser(objData);
  }, []);

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="addUsu-dialog-title"
        aria-describedby="addUsu-dialog-description"
      >
        <ValidatorForm onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">{`Agregar Usuario a la conversación`}</DialogTitle>
          <DialogContent>
            <AddUserForm
              dataAddUser={dataAddUser}
              setDataAddUser={setDataAddUser}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Agregar
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
};

export default AddUserConv;
