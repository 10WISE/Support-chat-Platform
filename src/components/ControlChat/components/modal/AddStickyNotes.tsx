import * as React from 'react';
import { useState } from 'react';
import * as _ from 'lodash';
import { useDispatch } from 'react-redux';
import { ValidatorForm } from 'react-material-ui-form-validator';

import {
  StickyNotes as StickyNotesHADS,
} from 'utils/HADSObjectsLocal';
type StickyNotes = StickyNotesHADS & { tipoSticky: number };

import './style.css';

import {
  Button,
  Typography,
  Box,
} from '@mui/material';
import AddStickyNotesForm from '../forms/AddStickyNotesForm';

interface AddStickyNotesDialogProps {
  dataAddStickyNotes: StickyNotes;
  setDataAddStickyNotes: any;
  setSelectFilter: any;
  setButtonAdd: any;
  setSwitchProject: any;
  handleSubmit: any;
  Add: any;
  setAdd: any;
  value: any;
  setValue: any;
  TitleForm: any;
  noteType: number;
  hasProfile: any;
}

declare const conn_HUB_URL: any;

const AddStickyNotes = (props: AddStickyNotesDialogProps) => {
  const dispatch = useDispatch();
  //const [Progress, setProgress] = useState(false);

  const {
    dataAddStickyNotes,
    setDataAddStickyNotes,
    setSelectFilter,
    setButtonAdd,
    setSwitchProject,
    handleSubmit,
    Add,
    setAdd,
    value,
    setValue,
    TitleForm,
    noteType,
    hasProfile,
  } = props;

  return (
    <Box sx={{overflowY: 'scroll',maxHeight: '400px',minHeight: '150px'}}>
      <ValidatorForm onSubmit={handleSubmit}>
        <Typography id="alert-dialog-title" sx={{textAlign: 'center'}}>
          {TitleForm ? (
            <b>{`Crear StickyNotes `}</b>
          ) : (
            <b>{`Editar StickyNotes `}</b>
          )}
        </Typography>

        <AddStickyNotesForm
          dataAddStickyNotes={dataAddStickyNotes}
          setDataAddStickyNotes={setDataAddStickyNotes}
          Add={Add}
          noteType={noteType}
          hasProfile={hasProfile}
        />

        <Button
          onClick={() => {
            setAdd(false);
            setValue({
              ...value,
              pos: value.pos,
            });
            setSelectFilter(true);
            setButtonAdd(true);
            setSwitchProject(true);
          }}
          style={{ float: 'right' }}
          color="primary"
        >
          Cancelar
        </Button>
        <Button type="submit" style={{ float: 'right' }} color="primary">
          Guardar
        </Button>
      </ValidatorForm>
    </Box>
  );
};

export default AddStickyNotes;
