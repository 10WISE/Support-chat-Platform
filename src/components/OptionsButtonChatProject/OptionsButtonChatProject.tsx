import * as React from 'react';
import { Fragment, useRef, useState } from 'react';

import { useSelector } from 'slices';
import * as _ from 'lodash';

import { Tooltip, IconButton, Menu, MenuItem } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ITEM_HEIGHT = 60;

const OptionsButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const moreRef = useRef(null);

  const { ticketSelectedProject } = useSelector((state) => state.app);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: any) => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip title="Listado de Usuarios ">
        <IconButton onClick={handleClick} ref={moreRef} size="small">
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '40ch',
          },
        }}
      >
        {ticketSelectedProject?.conversation.users &&
          ticketSelectedProject?.conversation.users.map((user: any, i) => {
            return (
              <MenuItem key={user.idUser}>
                {user.name} {user.lastName}
              </MenuItem>
            );
          })}
      </Menu>
    </Fragment>
  );
};
export default OptionsButton;
