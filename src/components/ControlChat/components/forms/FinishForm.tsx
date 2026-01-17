import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'slices';
import { TextValidator } from 'react-material-ui-form-validator';
import http from 'mixins/https';
import { setLoadingWait } from 'slices/app';
import { useDispatch } from 'react-redux';

import {
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  colors,
} from '@mui/material';

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

interface FinishFormProps {
  dataFinish: DataFinishProps;
  setDataFinish: React.Dispatch<React.SetStateAction<DataFinishProps>>;
  dataTypes: selectObject[];
}

const FinishForm = (props: FinishFormProps) => {
  const { dataFinish, setDataFinish, dataTypes } = props;
  const { ticketSelected } = useSelector((state) => state.app);

  const dispatch = useDispatch();

  const [dataSubTypes, setDataSubTypes] = useState([]);
  const [dataSpecification, setDataSpecification] = useState([]);

  const getSubTypes = async (value: string) => {
    try {
      dispatch(setLoadingWait(true));
      const { data } = await http.GetHADS(`automatic_typing/get_sub_types`, {
        idTicket: ticketSelected?.idTicket,
        idType: value,
      });
      dispatch(setLoadingWait(false));
      if (0 == data.length) {
        setDataSubTypes([{ id: '0', name: 'No Aplica' }]);
      } else {
        setDataSubTypes(data);
      }
    } catch (error) {
      dispatch(setLoadingWait(false));
    }
  };
  const GetSpecification = async (value: string) => {
    try {
      dispatch(setLoadingWait(true));
      const { data } = await http.GetHADS(
        `automatic_typing/get_specification`,
        {
          idTicket: ticketSelected?.idTicket,
          idSubType: value,
        }
      );
      dispatch(setLoadingWait(false));
      if (0 == data.length) {
        setDataSpecification([{ id: '0', name: 'No Aplica' }]);
      } else {
        setDataSpecification(data);
      }
    } catch (error) {
      dispatch(setLoadingWait(false));
    }
  };

  const handleChange = (event: any) => {
    setDataFinish({
      ...dataFinish,
      [event.target.name]: event.target.value,
    });
    if ('typeSupport' == event.target.name) {
      getSubTypes(event.target.value);
    }
    if ('subTypeSupport' == event.target.name) {
      GetSpecification(event.target.value);
    }
  };

  React.useEffect(() => {
    if (dataFinish.typeSupport) {
      getSubTypes(dataFinish.typeSupport);
    }
  }, [dataFinish.typeSupport]);

  React.useEffect(() => {
    if (dataFinish.subTypeSupport) {
      GetSpecification(dataFinish.subTypeSupport);
    }
  }, [dataFinish.subTypeSupport]);

  return (
    <Card>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextValidator
              id="standard-select-currency"
              fullWidth
              select
              value={dataFinish.typeSupport}
              name={'typeSupport'}
              onChange={handleChange}
              label="Tipo Soporte"
              helperText={'Seleccione una opción'}
              validators={['required']}
              errorMessages={['Campo requerido']}
            >
              {dataTypes.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              id="standard-select-currency"
              fullWidth
              select
              value={dataFinish.subTypeSupport}
              name={'subTypeSupport'}
              onChange={handleChange}
              label="Subtipo Soporte"
              helperText="Seleccione una opción"
              validators={['required']}
              errorMessages={['Campo requerido']}
            >
              {dataSubTypes.map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              id="standard-select-currency"
              fullWidth
              select
              value={dataFinish.specificationSupport}
              name={'specificationSupport'}
              onChange={handleChange}
              label="Especificación Soporte"
              helperText="Seleccione una opción"
              validators={['required']}
              errorMessages={['Campo requerido']}
            >
              {dataSpecification.map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Descripción Solución"
              onChange={handleChange}
              placeholder="Escriba tu Mensaje"
              minRows={4}
              value={dataFinish.descriptionSolution}
              name={'descriptionSolution'}
              multiline
              inputProps={{ 'aria-label': 'Escriba tu Mensaje' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              maxLength={4}
              fullWidth
              label="Comentario adicional"
              onChange={handleChange}
              placeholder="Escriba tu Mensaje"
              minRows={4}
              value={dataFinish.idExtra}
              name={'idExtra'}
              multiline
              inputProps={{ 'aria-label': 'Escriba tu Mensaje' }}
              validators={['maxStringLength:400']}
              errorMessages={['Máximo de caracteres 400']}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default FinishForm;
