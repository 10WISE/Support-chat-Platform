import clsx from 'clsx';
import * as React from 'react';
import { useSelector } from 'slices';
import { Fragment, useEffect, useState } from 'react';
import { withStyles } from '@mui/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { MenuItem, IconButton, Tooltip } from '@mui/material';

import NoteIcon from '@mui/icons-material/Note';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItemSticky = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#1E88FF',
    },
  },
}))(MenuItem);

interface CustomizedMenusProps {
  callbackPage: any;
  handleOpenModalStickyNotes: any;
  handleOpenAddUserModal: any;
}

export default function CustomizedMenus(props: CustomizedMenusProps) {
  const {  handleOpenModalStickyNotes, handleOpenAddUserModal } =
    props;

  const { ticketSelected } = useSelector((state) => state.app);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (ticketSelected.user?.userInfo?.userType == 'INTERNO') {
      ticketSelected.idProject == '242' || ticketSelected.idProduct == '8' || ticketSelected.idProduct == '26'
        ? setShowAddModal(true)
        : setShowAddModal(false);
    }
  }, [ticketSelected]);

  return (
    <Fragment>
      <Tooltip title="Opciones">
        <>
          <IconButton
            type="submit"
            aria-label="send"
            onClick={handleClick}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItemSticky>
              <ListItemIcon onClick={handleOpenModalStickyNotes}>
                <NoteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sticky Notes" />
            </StyledMenuItemSticky>
            {showAddModal && (
              <StyledMenuItemSticky>
                <ListItemIcon onClick={handleOpenAddUserModal}>
                  <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Agregar Usuario" />
              </StyledMenuItemSticky>
            )}
          </StyledMenu>
        </>
      </Tooltip>
    </Fragment>
  );
}
