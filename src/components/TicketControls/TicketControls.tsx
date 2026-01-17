import * as React from 'react';
import http from 'mixins/https';
import { useState, memo } from 'react';
import { useSelector } from 'slices';

import FinishDialog from '../ControlChat/components/modal/FinishDialog';
import ScaleDialog from '../ControlChat/components/modal/ScaleDialog';
import AddBugDialog from '../ControlChat/components/modal/AddBugDialog';
import AssociateBugDialog from '../ControlChat/components/modal/AssociateBugDialog';
import AlertDialog from '../ControlChat/components/modal/AlertDialog';
import ConfirmDialog from 'utils/ConfirmDialog';

import { BottomNavigationAction, BottomNavigation, Typography } from '@mui/material';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import BugReportIcon from '@mui/icons-material/BugReport';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

import {
  setTicketSelected,
  setMeetingSelected,
} from 'slices/app';

import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

const icon = {
  fontSize: {
    lg: 'x-large',
    md: 'x-large',
    sm: 'large'
  }
} as const;

declare var HADS_URL: any;


interface TicketControlsprops {
  hasProfile: boolean;
}

declare const window: any;

const TicketControls = (props: TicketControlsprops) => {
  const { hasProfile } = props;

  const [openModalFinish, setOpenModalFinish] = useState(false);
  const [openModalAddBug, setOpenModalAddBug] = useState(false);
  const [openModalScale, setOpenModalScale] = useState(false);
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [openModalAssociateBug, setOpenModalAssociateBug] = useState(false);

  const [textMessage, setTextMessage] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [valueTitle, setValueTitle] = React.useState('');

  const { ticketSelected, loggedUser } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const handleOpenModalFinish = () => {
    if (
      ticketSelected.user.userInfo.userType == 'INTERNO' &&
      ticketSelected.solved !== 'I'
    ) {
      Swal.fire({
        title: 'Atencion¡',
        html: 'La solicitud no ha sido atendida',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        backdrop: false,
        allowOutsideClick: false
      });
    } else {
      setOpenModalFinish(true);
    }
  };

  const handleOpenModalScale = () => {
    try {
      let urlFinalizar =
        HADS_URL + 'admin/#/' +
        'soporte/scale' +
        `?idConversation=${ticketSelected.conversation.idConversation}&idUser=${loggedUser.userInfo.idUser}&ku=${loggedUser.userInfo.userEncrypt}&kp=${loggedUser.userInfo.passwordEncrypt}`;
      window.open(urlFinalizar, '_blank');

    } catch (e) {
      console.error(e)
    }
  };

  const PauseSupport = async () => {
    try {
      var isAsignador = parseInt(ticketSelected?.isAsignador);
      if (isAsignador > 0) {
        window.createLoadingHADS();
        let obj = {
          InOrdenTrabajoTipo: ticketSelected.idProjectAllocator,
          InOrdenTrabajoIdProy: ticketSelected.idTicket,
          InUsuarioCedula: loggedUser.userInfo.documentId,
        };
        await http.PostConnect(`AsignadorUniversal/Pausar`, obj);
        dispatch(setTicketSelected(undefined));
        dispatch(setMeetingSelected(''));
        window.removeLoadingHADS();
      } else {
        dispatch(setTicketSelected(undefined));
        dispatch(setMeetingSelected(''));
        window.removeLoadingHADS();
      }
    } catch (error) {
      console.error(error);
      window.removeLoadingHADS();
    }
  };

  const handleOpenModalAddBug = () => {
    if (ticketSelected.idBug) {
      Swal.fire({
        title: 'Información!',
        html: `Ticket ${ticketSelected.idTicket} tiene un Bug asociado # ${ticketSelected.idBug}`,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        backdrop: false
      }).then((result: any) => {
        if (result.isConfirmed) {
          setOpenModalAddBug(false);
        }
      });
      return;
    }
    setOpenModalAddBug(true);
  };

  const handleOpenModalAssociateBug = React.useCallback(() => {
    setOpenModalAssociateBug(true);
  }, [ticketSelected]);

  return (
    <BottomNavigation sx={{
      boxSizing: 'border-box',
      marginTop: '4px',
      marginRight: '5px',
      marginLeft: '-5px',
      flexGrow: 1,
      width: '16.3%',
      border: '2px solid',
      borderColor: '#48FC69',
      borderRadius: '3px !important'
    }}
    >
      <BottomNavigationAction
        showLabel={true}
        label={'Asociar Bug'}
        icon={<Rotate90DegreesCcwIcon sx={icon} />}
        onClick={handleOpenModalAssociateBug}
        sx={{ padding: '0 !important' }}
      />

      {hasProfile && (
        <BottomNavigationAction
          showLabel={true}
          label={'Inyectar Bug'}
          icon={<BugReportIcon sx={icon} />}
          onClick={handleOpenModalAddBug}
          sx={{ padding: '0 !important' }}
        />
      )}

      <BottomNavigationAction
        showLabel={true}
        label={'Escalar'}
        icon={<CallMergeIcon sx={icon} />}
        onClick={handleOpenModalScale}
        sx={{ padding: '0 !important' }}
      />

      <BottomNavigationAction
        showLabel={true}
        label={'Pausar'}
        icon={<PauseCircleFilledIcon sx={icon} />}
        onClick={() => {
          PauseSupport();
        }}
        sx={{ padding: '0 !important' }}
      />

      <BottomNavigationAction
        showLabel={true}
        label={'Finalizar'}
        icon={<DoneOutlineIcon sx={icon} />}
        onClick={handleOpenModalFinish}
        sx={{ padding: '0 !important' }}
      />

      {openModalFinish && (
        <FinishDialog
          open={openModalFinish}
          setOpenModalFinish={setOpenModalFinish}
        />
      )}
      {openModalScale && (
        <ScaleDialog open={openModalScale} setOpenModal={setOpenModalScale} />
      )}
      {openModalAlert && (
        <AlertDialog
          open={openModalAlert}
          setOpenModal={setOpenModalAlert}
          title={'Usuario Desconectado'}
          message={
            'No es posible accionar esta opción debido a que se ha detectado que la cuenta actual logueado ha sido desconectada, por favor recargue la pagina o inicie sesión nuevamente.'
          }
        />
      )}
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
    </BottomNavigation>
  );
};

export default memo(TicketControls);
