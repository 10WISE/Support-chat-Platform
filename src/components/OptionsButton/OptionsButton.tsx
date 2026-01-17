import * as React from 'react';
import { Fragment, useRef, useState, memo } from 'react';
import { useSelector } from 'slices';

import FinishDialog from '../ControlChat/components/modal/FinishDialog';
import ScaleDialog from '../ControlChat/components/modal/ScaleDialog';
import AddBugDialog from '../ControlChat/components/modal/AddBugDialog';
import AssociateBugDialog from '../ControlChat/components/modal/AssociateBugDialog';
import AlertDialog from '../ControlChat/components/modal/AlertDialog';
import ConfirmDialog from 'utils/ConfirmDialog';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RedoIcon from '@mui/icons-material/Redo';
import BugReportIcon from '@mui/icons-material/BugReport';

import Swal from 'sweetalert2';

interface OptionsButtonprops {}

const OptionsButton = (props: OptionsButtonprops) => {
  const moreRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const isconned = useSelector((state) => state.connHub.isconned);

  const [openModalFinish, setOpenModalFinish] = useState(false);
  const [openModalAddBug, setOpenModalAddBug] = useState(false);
  const [openModalScale, setOpenModalScale] = useState(false);
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [openModalAssociateBug, setOpenModalAssociateBug] = useState(false);

  const [textMessage, setTextMessage] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [valueTitle, setValueTitle] = React.useState('');

  const { ticketSelected } = useSelector((state) => state.app);

  React.useEffect(() => {}, [ticketSelected.idBug]);

  const handleMenuOpen = () => {
    if (isconned) {
      setOpenMenu(true);
    } else {
      setOpenModalAlert(true);
    }
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleOpenModalFinish = () => {
    setOpenModalFinish(true);
  };

  const handleOpenModalScale = () => {
    setOpenModalScale(true);
  };

  const handleOpenModalAddBug = () => {
    if (ticketSelected.idBug) {
      Swal.fire({
        title: 'Información!',
        html: `Ticket ${ticketSelected.idTicket} tiene un Bug asociado # ${ticketSelected.idBug}`,
        icon: 'warning',
        // showCancelButton: false,
        confirmButtonText: 'Aceptar',
        // cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        backdrop: false,
        allowOutsideClick: false
      }).then((result: any) => {
        if (result.isConfirmed) {
          setOpenModalAddBug(false);
        }
      });
      return;
    }
    setOpenModalAddBug(true);
  };

  React.useEffect(() => {
    if (ticketSelected.idBug) {
      setValueTitle('Desasociar bug');
    } else {
      setValueTitle('Asociar bug');
    }
  }, [ticketSelected]);

  const handleOpenModalAssociateBug = React.useCallback(() => {
    // if (ticketSelected.idBug) {
    //   Swal.fire({
    //     title: 'Información!',
    //     html: `Ticket ${ticketSelected.idTicket} tiene un Bug asociado # ${ticketSelected.idBug}`,
    //     icon: 'warning',
    //     // showCancelButton: false,
    //     confirmButtonText: 'Aceptar',
    //     // cancelButtonText: 'No, cancel!',
    //     reverseButtons: true,
    //   }).then((result: any) => {
    //     if (result.isConfirmed) {
    //       setOpenModalAddBug(false);
    //     }
    //   });
    //   return;
    // }
    setOpenModalAssociateBug(true);
  }, [ticketSelected]);

  return (
    <Fragment>
      <Tooltip title="Opciones">
        <IconButton
          {...props}
          onClick={handleMenuOpen}
          ref={moreRef}
          size="small"
        >
          <MoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={moreRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleMenuClose}
        open={openMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <RedoIcon />
          </ListItemIcon>
          <ListItemText primary="Escalar" onClick={handleOpenModalScale} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DoneOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Finalizar" onClick={handleOpenModalFinish} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText
            primary="Inyectar Bug"
            onClick={handleOpenModalAddBug}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AcUnitIcon />
          </ListItemIcon>
          <ListItemText
            primary={valueTitle}
            onClick={handleOpenModalAssociateBug}
          />
        </MenuItem>
      </Menu>
      {openModalFinish && (
        <FinishDialog
          open={openModalFinish}
          setOpenModalFinish={setOpenModalFinish}
        />
      )}
      <ScaleDialog open={openModalScale} setOpenModal={setOpenModalScale} />
      <AlertDialog
        open={openModalAlert}
        setOpenModal={setOpenModalAlert}
        title={'Usuario Desconectado'}
        message={
          'No es posible accionar esta opción debido a que se ha detectado que la cuenta actual logueado ha sido desconectada, por favor recargue la pagina o inicie sesión nuevamente.'
        }
      />
      {openModalAddBug && (
        <AddBugDialog
          open={openModalAddBug}
          setOpenModalAddBug={setOpenModalAddBug}
        />
      )}
      {openModalAssociateBug && (
        <AssociateBugDialog
          open={openModalAssociateBug}
          setOpenModalAssociateBug={setOpenModalAssociateBug}
          title={valueTitle}
          option={ticketSelected.idBug ? '2' : '1'}
        />
      )}
      {confirmOpen && (
        <ConfirmDialog
          title="Atención:"
          open={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
          }}
          close={true}
          textButton={'Aceptar'}
          severity={'warning'}
        >
          {textMessage}
        </ConfirmDialog>
      )}
    </Fragment>
  );
};

export default memo(OptionsButton);
