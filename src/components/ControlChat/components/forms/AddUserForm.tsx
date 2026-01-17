import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'slices';
import { Card, CardContent, Grid, Divider, colors } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { TextValidator } from 'react-material-ui-form-validator';

const objData = {
  idUser: '',
  nameUser: '',
  reason: '',
  idUserCreate: '',
  idTicket: '',
};

const AddUserForm = (props: any) => {
  const { dataAddUser, setDataAddUser } = props;
  const [dataSubUser, setDataSubUser] = useState([]);
  const { loggedUser, ticketSelected } = useSelector((state) => state.app);
  const refAutoComplete = useRef<HTMLInputElement>(null);
  const [keyAutocomplete, setKeyAutocomplete] = useState(1);

  useEffect(() => {
    setDataAddUser({
      ...dataAddUser,
      meeting: ticketSelected.conversation.idConversation,
      creator: '0',
      userMod: '1',
    });
  }, []);

  const handleChange = (event: any) => {
    event.persist();
    setDataAddUser({
      ...dataAddUser,
      user: event.target.value,
    });
    if ('user' == event.target.name && 4 <= event.target.value.length) {
      try {
        setDataSubUser();
      } catch (error) {}
    }
    if ('typeUser' == event.target.name) {
      setDataSubUser([]);
      setKeyAutocomplete(event.target.value);
    }
  };

  return (
    <Card>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Autocomplete
              key={keyAutocomplete}
              ref={refAutoComplete}
              freeSolo
              onChange={(event, newValue) => {
                setDataAddUser({
                  ...dataAddUser,
                  user: newValue?.idUser,
                });
              }}
              id="select-user"
              options={dataSubUser}
              getOptionLabel={(option) => option.name + ' ' + option.lastName}
              renderInput={(params) => (
                <TextValidator
                  variant="outlined"
                  fullWidth
                  {...params}
                  margin="normal"
                  label="Usuario"
                  onChange={handleChange}
                  value={dataAddUser.user}
                  name={'user'}
                  validators={['required']}
                  errorMessages={['Campo requerido']}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default AddUserForm;
