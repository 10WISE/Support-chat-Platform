import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'slices';
import { addBug, setMessageInformation } from 'slices/app';
import * as _ from 'lodash';
import { useDispatch } from 'react-redux';
import { InjectBugDevops } from 'utils/HADSObjectsLocal';
import Swal from 'sweetalert2';
import ProgressCircular from 'utils/ProgressCircular';
import { validate } from 'validate.js';

import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Grid,
  CardContent,
  Divider,
  Card,
  colors,
} from '@mui/material';

interface AddBugDialogProps {
  open: boolean;
  setOpenModalAssociateBug: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  option: string;
}

const schema = {
  idBug: {
    presence: { allowEmpty: false, message: 'Campo requerido' },
    numericality: { onlyInteger: true, message: 'Debe ser númerico' },
    length: {
      maximum: 32,
    },
  },
};

const AssociateBugDialog = (props: AddBugDialogProps) => {
  const { open, setOpenModalAssociateBug, title, option, ...rest } = props;
  const dispatch = useDispatch();
  const [Progress, setProgress] = useState(false);

  const { ticketSelected, loggedUser } = useSelector((state) => state.app);

  const [formState, setFormState] = useState<any>({
    isValid: false,
    values: InjectBugDevops,
    touched: { idBug: false },
    errors: { idBug: '' },
  });

  useEffect(() => {}, [formState.values]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState: InjectBugDevops) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleClose = () => {
    setOpenModalAssociateBug(false);
  };

  const hasError = (field: string) => {
    return formState.touched[field] && formState.errors[field] ? true : false;
  };

  React.useEffect(() => {
    if (option == '2') {
      setFormState((formState: InjectBugDevops) => ({
        ...formState,
        isValid: true,
        errors: {},
      }));
    }
  }, [option]);

  const handleChange = (event: any) => {
    event.persist();

    setFormState((formState: any) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    setProgress(true);

    try {
      Swal.fire({
        title: 'Buen trabajo!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        backdrop: false,
        allowOutsideClick: false,
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.ExceptionMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          backdrop: false,
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
        fullWidth
        maxWidth="sm"
      >
        <form {...rest} onSubmit={handleSubmit}>
          <ProgressCircular open={Progress} setOpen={setProgress} />
          <DialogTitle id="alert-dialog-title">
            {`${title} Bug al Tk ${ticketSelected.idTicket} ${ticketSelected.projectName}`}
          </DialogTitle>
          <DialogContent>
            <Card>
              <Divider />
              <CardContent>
                {option == '1' && (
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={hasError('idBug')}
                        fullWidth
                        helperText={
                          hasError('idBug') ? formState.errors.idBug[0] : null
                        }
                        label="Número de Bug"
                        name="idBug"
                        onChange={handleChange}
                        value={formState.values.idBug || ''}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                )}
              </CardContent>
              <Divider />
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={!formState.isValid}>
              Aceptar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AssociateBugDialog;
