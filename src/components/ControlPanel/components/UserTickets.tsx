import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import http from 'mixins/https';
import {
  setTicketSelected,
  updateTicket,
  removeTicketsNew,
  setLoadingWait,
} from 'slices/app';
import { useSelector } from 'slices';
import connHub from 'connHub';
import * as _ from 'lodash';
import { Box, Theme } from '@mui/material'
import AlertDialog from '../../ControlChat/components/modal/AlertDialog';
import SnackBars from 'utils/SnackBar';
import { Snackbar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

import {
  setMessagesSelected,
  setMeetingSelected,
} from 'slices/app';

import {
  ListItemAvatar,
  List,
  ListItem,
  Typography,
  Grid,
  Badge,
  IconButton,
} from '@mui/material';

import { TicketL as TicketLHADS } from 'utils/HADSObjectsLocal';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Swal from 'sweetalert2';
type TicketL = TicketLHADS & { color: string };

interface UserTicketsProps {
  tickets: TicketL[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  colorBadge: any;
  setColorBadge: React.Dispatch<React.SetStateAction<any>>;
  timeBadge: boolean;
  setTimeBadge: React.Dispatch<React.SetStateAction<any>>;
  newSupport: number;
  themeMode: any;
}

declare const window: any;

export const UserTickets = (props: UserTicketsProps) => {
  const { tickets, selectedIndex, setSelectedIndex, colorBadge, timeBadge, themeMode } =
    props;
  const dispatch = useDispatch();

  const {
    loggedUser,
    meetingSelected,
    ticketSelected,
    ticketsNew,
    shareOnline,
  } = useSelector((state) => state.app);
  const isconned = useSelector((state) => state.connHub.isconned);
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [posBefore, setPosBefore] = useState({
    pos: -1,
    idConversation: '',
  });

  const ValidacionLogo = (event: any) => {
    event.target.src = 'img/logos/logo_aqui.png';
  };

  const handleReadByHADS = (tk: any) => {
    connHub.invoke(
      'ReadByHADS',
      tk.idConversation,
      loggedUser.userInfo.idUser
    )
      .done((res) => {
        if (res.code == '0') {
          const samplePayload = {
            idConversation: tk.idConversation,
            value: '0',
            orderBy: false,
          };
          dispatch(updateTicket(samplePayload));
        }
      })
      .catch((err) => {
        dispatch(setLoadingWait(false));
        console.error(err);
      });
  };

  const setSelectedSupport = async (i: number, ticket: TicketL) => {
    try {
      window.createLoadingHADS();
      const { data } = await http.Getconn(`conversation/get_messages`, {
        idConversation: ticket.conversation.idConversation,
        page: 0,
      });
      var sortData = _.orderBy(data, 'idMessage', 'asc');
      dispatch(setMessagesSelected(sortData));
      setPosBefore({
        pos: i,
        idConversation: ticket.conversation.idConversation,
      });
      dispatch(setTicketSelected(ticket));
      setSelectedIndex(i);
      dispatch(setMeetingSelected(ticket.conversation.idConversation));
    } catch (error) {
      Swal.fire({
        title: 'Atencion¡',
        html: 'No se han cargado los mensajes correctamente',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        backdrop: false,
        allowOutsideClick: false
      });
    }
    window.removeLoadingHADS();
  };

  const handleClickTicket = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ticket: TicketL,
    i: number
  ) => {
    if (ticketsNew.length > 0) {
      const pos = _.findIndex(ticketsNew, (o: any) => {
        return o.idTicket == ticket.idTicket;
      });
      dispatch(removeTicketsNew(pos));
    }
    if (isconned) {
      if (
        ticket.conversation.idConversation ==
        ticketSelected?.conversation?.idConversation
      )
        return;

      if (
        ticket.conversation.idConversation != meetingSelected ||
        meetingSelected == ''
      ) {
        try {
          var isAsignador = ticket?.isAsignador;
          var colorTk = ticket?.color;
          if (isAsignador == '1' && colorTk == 'rgb(214 126 126 / 50%)') {
            dispatch(updateTicket({
              idConversation: ticket?.conversation?.idConversation,
              color: 'rgb(243 51 37 / 48%)'
            }));
          }
          if (parseInt(isAsignador) > 0 && parseInt(isAsignador) < 4) {
            let activeRes = await Active(ticket);
            activeRes.code === '1' && (await setSelectedSupport(i, ticket));
          } else {
            if (parseInt(ticketSelected?.isAsignador) > 0) {
              let pauseRes = await Pause(ticketSelected);
              pauseRes.code === '1' && (await setSelectedSupport(i, ticket));
            } else {
              await setSelectedSupport(i, ticket);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      handleReadByHADS(ticket.conversation);
    } else {
      setOpenModalAlert(true);
    }
    setTimeout(() => {
      if (!window.componentEdesk) {
        window.clickActividad();
      }
      //Se valida si el topBar no esta en el dom se crea nuevamente
      if (0 == document.getElementsByClassName('topBar').length) {
        window.clickActividad();
      }
    }, 500);
  };

  const Active = async (ticket: TicketL) => {
    var res;
    try {
      window.createLoadingHADS();
      let obj = {
        InOrdenTrabajoTipo: ticket?.idProjectAllocator,
        InOrdenTrabajoIdProy: ticket?.idTicket,
        InUsuarioCedula: loggedUser.userInfo.documentId,
        idSophia: loggedUser.userInfo.idUser,
      };
      res = await http.Postconn(`AsignadorUniversal/Activar`, obj);
    } catch (error) {
      Swal.fire({
        title: 'Atencion¡',
        html: 'El ticket no ha sido activado',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        backdrop: false
      });
      res.code = '0';
    }
    window.removeLoadingHADS();
    return res;
  };

  const Pause = async (ticket: TicketL) => {
    var res;
    try {
      window.createLoadingHADS();
      let obj = {
        InOrdenTrabajoTipo: ticket?.idProjectAllocator,
        InOrdenTrabajoIdProy: ticket?.idTicket,
        InUsuarioCedula: loggedUser.userInfo.documentId,
      };
      res = await http.Postconn(`AsignadorUniversal/Pausar`, obj);
    } catch (error) {
      Swal.fire({
        title: 'Atencion¡',
        html: 'El ticket no ha sido Pausado',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        backdrop: false
      });
      res.code = '0';
    }
    window.removeLoadingHADS();
    return res;
  };

  return (
    <Box
      sx={{
        width: '103%',
        height: '100%',
        maxWidth: 400,
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: themeMode === 'dark' && '#020729',
      }}
    >
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          whiteSpace: 'pre-line',
          zIndex: 1300
        }}
        open={true}
      >
        <>
          {ticketsNew.map((tk: any, index) => {
            setTimeout(() => {
              const pos = _.findIndex(ticketsNew, (o: any) => {
                return o.idTicket == tk.idTicket;
              });
              dispatch(removeTicketsNew(pos));
            }, 10000);
            return (
              <SnackBars
                key={index}
                data={tk}
                clickHandler={(event: any) => {
                  const ticket = _.find(tickets, (e) => {
                    return e.idTicket == tk.idTicket;
                  });
                  const posT = _.findIndex(tickets, (o) => {
                    return o.idTicket == tk.idTicket;
                  });
                  handleClickTicket(event, ticket, posT);
                  setSelectedIndex(posT);
                }}
              />
            );
          })}
        </>
      </Snackbar>
      <List component="nav" aria-label="main mailbox folders" sx={{ backgroundColor: themeMode === 'dark' && '#020729' }}>
        {tickets.map((ticket, i = 0) => (
          <ListItem
            sx={{
              backgroundColor: selectedIndex != i && ticket.color,
              border:
                selectedIndex === i && ticket.isAns == '1'
                  ? `2px solid ${ticket.color}`
                  : selectedIndex === i && '2px solid #6c757d',
            }}
            button
            selected={selectedIndex === i}
            onClick={(event) => {
              handleClickTicket(event, ticket, i);
            }}
            key={i}
            divider={i < tickets.length}
          >
            {ticket.notificado == '1' &&
              <MarkEmailReadIcon sx={{ fontSize: "medium", color: '#F7A311', position: 'absolute', zIndex: 1, left: '1%', top: '5%' }} />
            }
            <Badge
              color={colorBadge}
              overlap="circular"
              invisible={i == 0 && !timeBadge ? false : true}
              badgeContent=" "
            ></Badge>
            <Badge
              color="error"
              overlap="circular"
              invisible={
                ticket.conversation.unreadMessagesCount == '0' ? true : false
              }
              badgeContent={ticket.conversation.unreadMessagesCount}
              sx={{
                "& .MuiBadge-badge": {
                  right: '1%',
                }
              }}
            >
              <ListItemAvatar>
              </ListItemAvatar>
              <Grid item xs container direction="column">
                <Grid item xs>
                  <Typography
                    component={'h6'}
                    noWrap
                    sx={{
                      padding: '0 !important',
                      margin: '0 !important',
                      fontSize: '10pt !important',
                      height: '21px !important',
                      color: themeMode === 'dark' ? '#FFFFFF' : '101010'
                    }}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '11.5rem',
                      fontSize: '10pt',
                    }}
                    gutterBottom
                    variant="subtitle1"
                  >
                    {ticket.idTicket} |{' '}
                    {ticket.idBug ? (
                      <Typography component={'span'} sx={{ color: '#F74B40', fontSize: 'small' }}>B {ticket.idBug}</Typography>
                    ) : (
                      ''
                    )}{' '}
                    <Typography component={'span'}
                      sx={{
                        fontSize: '12px !important',
                        margin: '0 !important',
                        marginLeft: '2px !important',
                        color: '#FFF',
                        right: '0px !important',
                        backgroundColor: ticket.user.userInfo.userType == 'INTERNO' ? '#008080' : '#FF2727'
                      }}
                    >
                      {ticket.user.userInfo.userType == 'INTERNO'
                        ? 'INT'
                        : 'EXT'}
                    </Typography>
                    <Typography component={'span'}
                      sx={{
                        fontSize: '12px !important',
                        margin: '0 !important',
                        marginLeft: '2px !important',
                        color: '#FFF',
                        right: '0px !important',
                        backgroundColor: ticket.loggedIn == '1' ? '#A4A4A4' : '#2F7ED5'
                      }}
                    >
                      {ticket.loggedIn == '1' ? 'SIN' : 'LOG'}
                    </Typography>
                    {ticket.state == 'ESCALADO' && (
                      <Typography component={'span'}
                        sx={{
                          fontSize: '12px !important',
                          margin: '0 !important',
                          marginLeft: '2px !important',
                          color: '#FFF',
                          right: '0px !important',
                          backgroundColor: '#11BB00'
                        }}
                      >
                        {'ES'}
                      </Typography>
                    )}
                  </Typography>
                  <Typography
                    component={'div'}
                    sx={{
                      padding: '0 !important',
                      margin: '0 !important',
                      fontSize: '9.5pt !important',
                      width: '100% !important',
                      height: '14px !important',
                      verticalAlign: 'text-top !important',
                      color: themeMode === 'dark' ? '#FFF' : '101010'
                    }}
                    gutterBottom
                    variant="body2"
                  >
                    {<b>{ticket.projectName}</b>}
                  </Typography>
                </Grid>
              </Grid>
              {shareOnline == ticket.conversation.idConversation && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 0.5,
                    top: '-20px'
                  }}
                  style={{ color: '#44B6FC', float: 'left' }}
                >
                  <ShareIcon />
                </IconButton>
              )}
            </Badge>
          </ListItem>
        ))}
      </List>
      <AlertDialog
        open={openModalAlert}
        setOpenModal={setOpenModalAlert}
        title={'Usuario Desconectado'}
        message={
          'No es posible listar los ticket asignados debido a que se ha detectado que la cuenta actual logueado ha sido desconectada, por favor recargue la pagina o inicie sesión nuevamente.'
        }
      />
    </Box>
  );
};
