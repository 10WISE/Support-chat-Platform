import * as React from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import './style.css';
import {
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';

interface DataAssociateBugProps {
  idBug: string;
}

interface AddFormProps {
  dataAssociateBug: DataAssociateBugProps;
  setDataAssociateBug: React.Dispatch<
    React.SetStateAction<DataAssociateBugProps>
  >;
}

const AddBugForm = (props: AddFormProps) => {
  const { dataAssociateBug, setDataAssociateBug } = props;

  const handleChange = (event: any) => {
    event.persist();
    setDataAssociateBug({
      ...dataAssociateBug,
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
              label="Número de Big"
              onChange={handleChange}
              placeholder="Escribe Titulo del Bug"
              minRows={2}
              value={dataAssociateBug.idBug}
              name={'idBug'}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required', 'matchRegexp:^[0-9]+:[0-9]+$']}
              errorMessages={['Campo requerido', 'Solo se permite Números ']}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default AddBugForm;
