import * as React from 'react';
import { useEffect, useState } from 'react';
import connHub from 'connHub';
import { useDispatch } from 'react-redux';
import {
  addTicket,
  setTicketsNew,
  setTickets,
  setMessageInformation,
  setStatisticsUsers,
  removeTicket,
  updateAns,
  setTicketSelected,
  setMeetingSelected,
  setNumerales,
  updateMessagesFlag,
  addMessagesSelected,
  updateTicket,
  addMessagesSelectedProject,
  updateLoggedUser
} from 'slices/app';
import { useSelector } from 'slices';
import SearchIcon from '@mui/icons-material/Search';
import * as _ from 'lodash';
import { DateTime } from "luxon";
import LoadingWait from 'utils/LoadingWait';
import { UserTickets } from './components/UserTickets';
import { Paper, Typography, Input, Box } from '@mui/material';
import { MessageL, ProductL, ProjectL, TicketL, TicketL as TicketHADS } from 'utils/HADSObjectsLocal';
type Ticket = TicketHADS & { color: string };
import { store } from 'index';
import { setIsconned } from 'slices/connHub';
import AlertDialog from '../ControlChat/components/modal/AlertDialog';
import ConfirmDialog from 'utils/ConfirmDialog';
import http from 'mixins/https';
import { WriteLog } from 'utils/plog';
import validateMessage from 'utils/validateMessage';

const useInterval = (callback: any, delay: any) => {
  const intervalRef = React.useRef(undefined);
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  React.useEffect(() => {
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(
        () => callbackRef.current(),
        delay
      );

      // Clear interval if the components is unmounted or the delay changes:
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  // Returns a ref to the interval ID in case you want to clear it manually:
  return intervalRef;
};

interface ControlPanelProps {
  themeMode: string;
}

declare const window: any;

export const ControlPanel = (props: ControlPanelProps) => {
  const { themeMode } = props;
  const dispatch = useDispatch();

  const isconned = useSelector((state) => state.connHub.isconned);
  const {
    tickets,
    ticketSelected,
    ticketsNew,
    loggedUser,
    timeProject,
    numerales,
    messagesFlag,
    ticketSelectedProject
  } = useSelector((state) => state.app);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [colorBadge, setColorBadge] = useState('secondary');

  const [newSupport, setNewSupport] = useState(0);

  const [ticketFilter, setTicketFilter] = useState([]);
  const [groupMeetings, setGroupMeetings] = useState<Array<string>>([]);
  const [timeBadge, setTimeBadge] = useState(true);
  const [openModalAlert, setOpenModalAlert] = useState(false);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState('');

  useEffect(() => {
    try {
      loggedUser?.products?.map((product: ProductL, i) => {
        product.projects?.forEach((project: ProjectL) => {
          setGroupMeetings(groupMeetings => [...groupMeetings, project.conversation.idConversation])
        });
      });
    }
    catch (e) {
      console.log(e);
    }
  }, [loggedUser]);

  const NewTicket = (res: any) => {
    const index = tickets.findIndex(
      (t: TicketL) => t.idTicket == res?.idTicket
    );
    if (index != -1) {
      return;
    }
    let message: string;
    dispatch(setMessageInformation({ message: 'Nuevo Ticket' }));

    if (res.isAsignador == '1') {
      res.color = 'rgb(214 126 126 / 50%)';
      message = 'Nuevo ticket';
    } else {
      res.color = 'ESCALADO' == res.state ? 'rgb(76 175 80 / 48%)' : 'rgb(243 51 37 / 48%)';
      message = 'ESCALADO' == res.state ? 'Nuevo ticket escalado' : 'Nuevo ticket';
    }

    dispatch(
      setTicketsNew({
        idTicket: res.idTicket,
        projectName: res.projectName,
        message: message,
        color: 'ESCALADO' == res.state ? 'success' : 'error',
      })
    );

    try {
      dispatch(
        setStatisticsUsers({
          option: 1,
          value: parseInt(loggedUser.statistics.inAtention) + 1,
        })
      );
    } catch (error) {
      console.error(error);
    }
    dispatch(addTicket(res));
    if ('ESCALADO' != res.state) {
      setSelectedIndex(null);
    }
  };

  const HADS_Message = (res: any) => {
    const newMessage: MessageL = res.message;

    if (loggedUser?.userInfo?.documentId == '37550545' ||
      loggedUser?.userInfo?.documentId == '1098760516' ||
      loggedUser?.userInfo?.documentId == '1098812145') {
      WriteLog(newMessage);
      }

    let color;
    if (groupMeetings.includes(newMessage.idConversation)) {
      if (
        ticketSelectedProject?.conversation?.idConversation ==
        newMessage.idConversation
      ) {
        dispatch(addMessagesSelectedProject(newMessage));
      } else {
        const matchMeeting = _.find(groupMeetings, (e) => {
          return e == newMessage.idConversation;
        });
        if (matchMeeting != null) {
          const samplePayload = {
            idConversation: newMessage.idConversation,
            value: '1',
          };
          dispatch(updateLoggedUser(samplePayload));
        }
      }
    } else {
      if (
        newMessage.idConversation == ticketSelected?.conversation?.idConversation
      ) {
        dispatch(addMessagesSelected(newMessage));
      }
      if (
        newMessage.idConversation != ticketSelected?.conversation?.idConversation
      ) {
        const infoTicket = _.find(tickets, (e) => {
          return e.conversation.idConversation == newMessage.idConversation;
        });

        /**TODO: Desquemar la comparaciones para que no vengan por onMessage si no que
         * vengan por un escucha especifico */
        let valValidate = validateMessage(newMessage.content, 48);

        if (typeof valValidate == 'object') {
          color = valValidate.color;
          dispatch(
            setTicketsNew({
              idTicket: infoTicket.idTicket,
              projectName: infoTicket.projectName,
              message: valValidate.message,
              color: valValidate.type,
            })
          );
        }
      }

      if (
        newMessage.idConversation != ticketSelected?.conversation?.idConversation
      ) {
        const samplePayload = {
          idConversation: newMessage.idConversation,
          value: '1',
          orderBy: true,
          color: color,
        };
        dispatch(updateTicket(samplePayload));
        dispatch(updateMessagesFlag(1));
      }

      var date = new Date().toString();
      dispatch(
        updateAns({
          idConversation: newMessage.idConversation,
          value: '3',
          isAns: '0',
          dateAns: date,
          iconAns: '0',
          color: color,
        })
      );
    }
  };

  const ticketQualified = (res: any) => {
    try {
      HADS_Message(res);
      const samplePayload = {
        idConversation: res.message?.idConversation,
        value: '2',
        orderBy: false,
      };
      dispatch(updateTicket(samplePayload));
    } catch (error) {
      console.log(error);
    }
  };

  const HADS_Disconn = (res: any) => {
    store.dispatch(setIsconned(false));
    setOpenModalAlert(true);
  };

  useEffect(() => {
    setTicketFilter(tickets);
  }, [tickets]);

  useEffect(() => {
    if (isconned) {
      connHub.invoke('GetTicketsUser', loggedUser.userInfo.idUser)
        .done((res) => {
          var newTickets = _.map(res, (element) => {
            return _.extend({}, element, { color: '' });
          });
          dispatch(setTickets(newTickets));
        })
        .catch((err) => {
          console.error(err);
        });
      getNumerales();
    }
  }, [isconned]);

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
        await http.Postconn(`AsignadorUniversal/Pausar`, obj);
      }
      dispatch(setTicketSelected(undefined));
      dispatch(setMeetingSelected(''));
      setSelectedIndex(-1)
      window.removeLoadingHADS();
    } catch (error) {
      console.error(error);
      window.removeLoadingHADS();
    }
  };

  const KeyPress = (e: any) => {
    if (e.key === "Escape" && ticketSelected !== undefined) {
      if (!window.isLoadingHADS()) {
        PauseSupport();
      }
    }
  };
  document.onkeydown = KeyPress;


  const getNumerales = async () => {
    if (numerales.length == 0) {
      try {
        const { data } = await http.Getconn(`get_numeral`);
        dispatch(setNumerales(data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    try {
      const dragOverEvent = (event: DragEvent) => {
        event.preventDefault();
      };
      document.addEventListener('dragover', dragOverEvent);

      const dropEvent = (event: DragEvent) => {
        event.preventDefault();
        /**
         * Valida su arrastran un archivo en una zona indebida
         * se debe validar que no sea en la zona correcta para que muestre el mensaje
         */
        if (
          !event.target.className?.toUpperCase().includes('MUIDROPZONEAREA') &&
          event.dataTransfer.types[0] == 'Files'
        ) {
          setTextMessage(
            `Por favor adjunte el archivo en el área permitida. <br> El área permitida es sobre la conversación`
          );
          setConfirmOpen(true);
        }
      };
      document.addEventListener('drop', dropEvent);
      return () => {
        document.removeEventListener('dragover', dragOverEvent);
        document.removeEventListener('drop', dropEvent);
      };
    } catch (error) { }
  }, []);


  const removeAll = (res: any) => {
    try {
      const pos = _.findIndex(tickets, function (o) {
        return o.conversation.idConversation == res.value.m;
      });
      if (pos != -1) {
        dispatch(removeTicket(pos));
        dispatch(setTicketSelected(undefined));
        let obj = {
          isVisible: true,
          message: `Ticket finalizado ${tickets[pos].idTicket} con éxito`,
        };
        dispatch(setMessageInformation(obj));
        try {
          dispatch(
            setStatisticsUsers({
              option: 1,
              value: parseInt(loggedUser.statistics.inAtention) - 1,
            })
          );
          dispatch(
            setStatisticsUsers({
              option: 3,
              value: parseInt(loggedUser.statistics.solved) + 1,
            })
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
    catch (error) {
      console.error('Fallo removeAll' + error);
    }

  };

  const RemoveTicket = (res: TicketL) => {
    try {
      const pos = _.findIndex(tickets, function (o) {
        return o.conversation.idConversation == res.conversation.idConversation;
      });
      if (pos != -1) {
        dispatch(removeTicket(pos));
        dispatch(setTicketSelected(undefined));
        dispatch(setMeetingSelected(''));
        try {
          dispatch(
            setStatisticsUsers({
              option: 1,
              value: parseInt(loggedUser.statistics.inAtention) - 1,
            })
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
    catch (error) {
      console.error('Fallo RemoveTicket' + error);
    }
  };

  useEffect(() => {
    connHub.on('HADS_RemoveAll', removeAll);
    return () => {
      connHub.off('HADS_RemoveAll', removeAll);
    };
  }, [tickets.length, loggedUser.statistics, messagesFlag]);

  useEffect(() => {
    connHub.on('HADSRemoveTicket', RemoveTicket);

    return () => {
      connHub.off('HADSRemoveTicket', RemoveTicket);
    };
  }, [tickets.length, , loggedUser.statistics, messagesFlag]);

  useEffect(() => {
    connHub.on('HADS_NewTicket', NewTicket);
    return () => {
      connHub.off('HADS_NewTicket', NewTicket);
    };
  }, [loggedUser, tickets.length]);

  useEffect(() => {
    connHub.on('HADS_Message', HADS_Message);

    connHub.on('ticketQualify', ticketQualified);

    //Elimina el escucha del connHub
    return () => {
      connHub.off('HADS_Message', HADS_Message);
      connHub.off('ticketQualify', ticketQualified);
    };
  }, [tickets, ticketSelected, ticketSelectedProject]);

  useEffect(() => {
    connHub.on('HADS_Disconn', HADS_Disconn);
    return () => {
      connHub.off('HADS_Disconn', HADS_Disconn);
    };
  }, [loggedUser, tickets.length]);

  useEffect(() => {
    if (typeof ticketSelected == 'object') {
      const posT = _.findIndex(tickets, (o) => {
        return o.idTicket == ticketSelected.idTicket;
      });
      setSelectedIndex(posT);
    }
  }, [ticketSelected]);

  useEffect(() => {
    if (typeof ticketSelected == 'object') {
      const posT = _.findIndex(tickets, (o) => {
        return o.idTicket == ticketSelected.idTicket;
      });
      setSelectedIndex(posT);
    }
    if (ticketsNew.length > 0) {
      setTimeBadge(false);
      const intervalId = setInterval(() => {
        setColorBadge((colorBadge) =>
          colorBadge == 'primary' ? 'secondary' : 'primary'
        );
      }, 1000);

      setTimeout(() => {
        setTimeBadge(true);
        clearInterval(intervalId);
        setColorBadge('secondary');
      }, 20000);
    }
  }, [ticketsNew.length, tickets.length]);

  const [time, setTime] = React.useState(0);

  const intervalRef = useInterval(() => {
    ValidateTimeAns(tickets);
    setTime(time + 1);
  }, 10000);

  useEffect(() => {
    window.onbeforeunload = () => {
      window.clearInterval(intervalRef.current);
    };
  }, []);

  const ValidateTimeAns = (tickets: Ticket[]) => {
    tickets.forEach((e) => {
      if (e.isAns == '1') {
        const time1 = _.find(timeProject, (s) => {
          return s.idProject == e.idProject;
        });
        const time = parseInt(time1?.time);
        let init = DateTime.now();
        let end = DateTime.fromISO(`${e.dateAns}`);
        const minutesDiff = end.diff(init, 'minutes');
        const payload = {
          idConversation: e.conversation.idConversation,
          value: '3',
          iconAns: '0',
          ...{ color: minutesDiff.minutes >= time ? '#FF6443' : e.color },
        };
        dispatch(updateAns(payload));
      }
    });
  };

  return (
    <>
      <LoadingWait />
      <Paper sx={{ margin: '8px', backgroundColor: themeMode === 'dark' && '#020729' }}>
        {loggedUser && (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{
              textAlign: 'center',
              padding: 'auto',
              margin: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:not(:last-of-type)': {
                borderRight: `1px solid ${'divider'}`,
              },
            }}
              key={0}>
              <Typography
                align="center"
                component="h6"
                gutterBottom
                variant="subtitle1"
                sx={{ color: themeMode === 'dark' ? '#FFF' : '101010' }}
              >
                En Trámite
              </Typography>
              <Typography align="center" variant="h4" sx={{ color: themeMode === 'dark' ? '#FFF' : '101010' }}>
                {loggedUser.statistics.inAtention}
              </Typography>
            </Box>
            <Box sx={{
              textAlign: 'center',
              padding: 'auto',
              margin: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:not(:last-of-type)': {
                borderRight: `1px solid ${'divider'}`,
              },
            }}
              key={1}>
              <Typography
                align="center"
                component="h6"
                gutterBottom
                variant="subtitle1"
                sx={{ color: themeMode === 'dark' ? '#FFF' : '101010' }}
              >
                Solucionados
              </Typography>
              <Typography align="center" variant="h4" sx={{ color: themeMode === 'dark' ? '#FFF' : '101010' }}>
                {loggedUser.statistics.solved}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
      <Paper sx={{
        height: 42,
        margin: 1,
        display: 'flex',
        alignItems: 'center',
        flex: {
          sm: '1 1 auto',
        },
        backgroundColor: themeMode === 'dark' && '#020729'
      }}>
        <SearchIcon sx={{ marginRight: 2, marginLeft: 2, color: themeMode === 'dark' ? '#FFF' : '101010' }} />
        <Input
          sx={{
            flexGrow: 1,
            width: '70% !important',
            color: themeMode === 'dark' ? '#FFF' : '101010',
          }}
          disableUnderline
          placeholder="Buscar ticket"
          onChange={(e) => {
            const filterTicketsResult = tickets.filter((item) => {
              return (
                item.idTicket
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                item.projectName
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
              );
            });
            setTicketFilter(filterTicketsResult);
          }}
        />
      </Paper>
      <Paper sx={{ margin: '8px', backgroundColor: themeMode === 'dark' && '#020729' }}>
        <UserTickets
          tickets={ticketFilter}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          colorBadge={colorBadge}
          timeBadge={timeBadge}
          setTimeBadge={setTimeBadge}
          setColorBadge={setColorBadge}
          newSupport={newSupport}
          themeMode={themeMode}
        />
      </Paper>
      {openModalAlert && (
        <AlertDialog
          open={openModalAlert}
          setOpenModal={setOpenModalAlert}
          title={'Usuario Desconectado'}
          message={`Se inició una nueva conexión a conn desde otra página, solo se puede mantener una conexión 
            en cualquier instante, si desea conectarse desde esta página por favor refrésquela (F5) `}
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
    </>
  );
};

