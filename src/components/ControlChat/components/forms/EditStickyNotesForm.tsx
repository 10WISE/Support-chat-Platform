import * as React from 'react';
import {
  Card,
  Divider,
  CardContent,
  Grid,
  Theme,
  colors
} from '@mui/material';
import { StickyNotes } from 'utils/HADSObjectsLocal';
import { TextValidator } from 'react-material-ui-form-validator';
import * as _ from 'lodash';


interface EditStickyNotesProps {
  dataEditStickyNotes: StickyNotes;
  setDataEditStickyNotes: React.Dispatch<React.SetStateAction<StickyNotes>>;
}

const EditStickyNotesForm = (props: EditStickyNotesProps) => {
  const { dataEditStickyNotes, setDataEditStickyNotes } = props;

  const handleChange = (event: any) => {
    event.persist();
    setDataEditStickyNotes({
      ...dataEditStickyNotes,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Card>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Titulo Sticky"
              onChange={handleChange}
              placeholder="Escribe Titulo del Sticky"
              minRows={2}
              name={'titleSticky'}
              // defaultValue={dataEditStickyNotes.titleSticky}
              value={dataEditStickyNotes.titleSticky}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Cuerpo Sticky"
              onChange={handleChange}
              placeholder="Escribe cuerpo del Sticky"
              rows={2}
              name={'bodySticky'}
              // defaultValue={dataEditStickyNotes.bodySticky}
              value={dataEditStickyNotes.bodySticky}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default EditStickyNotesForm;
