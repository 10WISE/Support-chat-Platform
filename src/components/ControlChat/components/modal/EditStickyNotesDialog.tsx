import * as React from 'react';
import { useState } from 'react';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { ValidatorForm } from 'react-material-ui-form-validator';
import ProgressCircular from 'utils/ProgressCircular';
import { StickyNotes } from 'utils/HADSObjectsLocal';
import './style.css';

import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
} from '@mui/material';
import EditStickyNotesForm from '../forms/EditStickyNotesForm';

interface EditStickyNotesDialogProps {
  open: boolean;
  setOpenModalEditSticky: React.Dispatch<React.SetStateAction<boolean>>;
  callbackPage: any;
  dataEditStickyNotes: StickyNotes;
  setDataEditStickyNotes: React.Dispatch<React.SetStateAction<StickyNotes>>;
  noteType: any;
}

const EditStickyNotesDialog = (props: EditStickyNotesDialogProps) => {
  const {
    open,
    setOpenModalEditSticky,
    dataEditStickyNotes,
    setDataEditStickyNotes,
    noteType,
  } = props;
  const [Progress, setProgress] = useState(false);

  const handleClose = () => {
    setOpenModalEditSticky(false);
  };

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    setProgress(true);

    try {
      let url = `api/StickyNotes/personales/${dataEditStickyNotes}/update`;

      setProgress(false);
      Swal.fire({
        title: 'Buen trabajo!',
        icon: 'success',
        // showCancelButton: false,
        confirmButtonText: 'Aceptar',
        // cancelButtonText: 'No, cancel!',
        reverseButtons: true,
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
            {`Editar StickyNotes `}
          </DialogTitle>
          <DialogContent>
            <EditStickyNotesForm
              dataEditStickyNotes={dataEditStickyNotes}
              setDataEditStickyNotes={setDataEditStickyNotes}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
};

export default EditStickyNotesDialog;
