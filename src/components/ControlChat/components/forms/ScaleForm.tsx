import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { TextValidator } from 'react-material-ui-form-validator';

interface DataScaleProps {
  typeUser: string;
  idUser: string;
  nameUser: string;
  reason: string;
  idUserCreate: string;
  idTicket: string;
}

interface ScaleFormProps {
  dataScale: DataScaleProps;
  setDataScale: React.Dispatch<React.SetStateAction<DataScaleProps>>;
}

const ScaleForm = (props: ScaleFormProps) => {
  const { dataScale, setDataScale } = props;
  const [dataSubUser, setDataSubUser] = useState([]);
  const refAutoComplete = useRef<HTMLInputElement>(null);
  const [keyAutocomplete, setKeyAutocomplete] = useState(1);

  const handleChange = (event: any) => {
    event.persist();
    setDataScale({
      ...dataScale,
      [event.target.name]: event.target.value,
    });
    if ('nameUser' == event.target.name && 6 <= event.target.value.length) {
      try {
        setDataSubUser();
      } catch (error) {}
    }
    if ('typeUser' == event.target.name) {
      setDataSubUser([]);
      /**
       * Cuando se cambia de tipo de usuario se cambia el key de AutoComplete
       * para generar un nuevo renderizado y se limpie el component
       */
      setKeyAutocomplete(event.target.value);
    }
  };

  return (
    <Card>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <FormLabel component="legend">Tipo Usuario</FormLabel>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="Tipo Usuario"
                name="typeUser"
                value={dataScale.typeUser}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="Interno"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="primary" />}
                  label="Externo"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              key={keyAutocomplete}
              ref={refAutoComplete}
              freeSolo
              onChange={(event, newValue) => {
                setDataScale({
                  ...dataScale,
                  nameUser: newValue?.name + ' ' + newValue?.lastName,
                  idUser: newValue?.idUser,
                });
              }}
              id="country-select-demo"
              options={dataSubUser}
              getOptionLabel={(option) => option?.name + ' ' + option?.lastName}
              renderOption={(props, item) => (
                <li {...props} key={item?.idUser}>
                  {' '}
                  {item?.name + ' ' + item?.lastName}{' '}
                </li>
              )}
              renderInput={(params) => (
                <TextValidator
                  variant="outlined"
                  fullWidth
                  {...params}
                  margin="normal"
                  label="Usuario"
                  onChange={handleChange}
                  value={dataScale?.idUser}
                  name={'nameUser'}
                  validators={['required']}
                  errorMessages={['Campo requerido']}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              variant="outlined"
              fullWidth
              label="Motivo"
              onChange={handleChange}
              placeholder="Describa el motivo por el cual desea escalar la solicitud"
              minRows={4}
              value={dataScale.reason}
              name={'reason'}
              multiline
              inputProps={{
                'aria-label':
                  'Escriba una razón o motivo por el cual desea escalar la solicitud.',
              }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default ScaleForm;
