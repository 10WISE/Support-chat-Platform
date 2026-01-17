import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Box, createTheme } from '@mui/material'
import connHub from 'connHub';
import { MessageL } from 'utils/HADSObjectsLocal';
import * as _ from 'lodash';
import AlertMessage from 'utils/AlertMessage';
import AlertDialog from '../ControlChat/components/modal/AlertDialog';
import UpLoadFile from 'components/global/buttons/UpLoadFile';
import SharedScreen from 'connHub/SharedScreen';

import {
  addMessagesSelected,
  addMessagesSelectedPaginate,
  setTicketSelectedProject,
  updateAns,
  setLoadingWait,
  setMessagesSelected,
  addIdNewMessage,
  setDragging,
  updateTicket
} from 'slices/app';
import { useDispatch } from 'react-redux';
import ConversationMessage from './components/ConversationMessage';
import ChatProject from './components/ChatProject';

import DropZone from 'utils/DropZone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmDialog from 'utils/ConfirmDialog';
import AddUserConv from './components/modal/AddUserConv';
import OptionsConversations from 'components/global/menus/OptionsConversations';
import TicketControls from 'components/TicketControls';
import ToolBar from 'components/ToolBar';

import { TreeChatGroups } from 'views';
import StickyNotesDialogInternal from 'components/ControlChat/components/modal/StickyNotesDialogInternal';
import StickyNotesDialogRenderFirst from 'components/ControlChat/components/modal/StickyNotesDialogRenderFirst';

import {
  ThemeProvider,
  Paper,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  PaletteMode
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import { useSelector } from 'slices';
import http from 'mixins/https';
import Swal from 'sweetalert2';
import https from 'mixins/https';
import GetFileCopy from '../../utils/GetFileCopy';
import ControlPanel from 'components/ControlPanel';
import { DateTime } from 'luxon';

const gridItem = {
  fontWeight: 'bold',
  textAlign: 'left',
  fontSize: { xl: '14px', lg: '12px', md: '10px' },
  padding: '0px !important',
  margin: '0px !important',
  color: 'text.primary',
} as const;

const gridItem3 = {
  textAlign: 'left',
  fontSize: { xl: '15px', lg: '12px', md: '10px' },
  //marginLeft: '16px !important',
  padding: '0px !important',
  margin: '0px !important',
  color: 'text.primary',
} as const;

const squareInt = {
  padding: 2,
  fontSize: '8pt',
  color: '#FFF',
  borderRadius: '3px !important',
} as const;

const squareLog = {
  padding: 2,
  fontSize: '8pt',
  color: '#FFF',
  borderRadius: '3px !important',
} as const;

const gridTools = {
  display: 'flex',
  marginTop: '-2px',
  position: 'relative',
  left: '16.99%',
} as const;


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // palette values for dark mode
    primary: { main: '#fff', contrastText: '#fff' },
    secondary: { main: '#101010' },
    divider: '#44B6FC',
    background: {
      default: '#0B0B0B',
      paper: '#020729',
    },
    text: {
      primary: '#fff',
      secondary: '#C7C6C6',
    },
    grey: {
      200: '#1e2964',
      400: '#7BB7FA',
    },
    error: {
      main: '#F74B40',
    },
  },
});

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });


interface ControlChatRenderProps {
  setOpenModalStickyNotes: any;
  setOpenAddUsuModal: any;
  refWrittenMessage: any;
  themeMode: string;
  columns: number;
  ToggleWindowSize: any;
}

let pageMessage = 0;
let scrollHeightCurrent = 0;
declare const window: any;

const ControlChatRender = (props: ControlChatRenderProps) => {
  const {
    setOpenModalStickyNotes,
    refWrittenMessage,
    themeMode,
    setOpenAddUsuModal,
    columns,
    ToggleWindowSize
  } = props;

  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [servicePointData, setServicePointData] = useState({
    titlePoint: null,
    namePoint: null,
  });
  const [dragOver, setDragOver] = useState(false);

  const [showEndConversation, setShowEndConversation] = useState(false);
  const isconned = useSelector((state) => state.connHub.isconned);
  const { loggedUser, ticketSelected, messagesSelected, Dragging, numerales } =
    useSelector((state) => state.app);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState('');
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();

  const refPaper = useRef<HTMLInputElement>(null);

  const [timeLeft, setTimeLeft] = useState(1);

  // initialize timeLeft with the seconds prop
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft + 1);
    }, 60000);
    // intervalo Se limpia volver a renderizar para
    // evitar pérdidas de memoria
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  useEffect(() => {
    if (ticketSelected != undefined) {
      const servicePoint = ticketSelected.user.userInfo.servicePoint;
      const userType = ticketSelected.user.userInfo.userType;
      if ('' == servicePoint && 'INTERNO' == userType) {
        setServicePointData({
          titlePoint: 'Punto Atención :',
          namePoint: 'Natura',
        });
      } else if ('' != servicePoint && 'INTERNO' == userType) {
        setServicePointData({
          titlePoint: 'Punto Atención :',
          namePoint: servicePoint,
        });
      } else {
        setServicePointData({
          titlePoint: null,
          namePoint: null,
        });
      }
      pageMessage = 0;

    }
  }, [ticketSelected]);

  const validateCommand = (message: string) => {
    let mess = message.trim();
    const matchNumeral = _.find(numerales, (e) => {
      return e.numeral == mess;
    });

    if (!matchNumeral) {
      Swal.fire({
        title: '!Info',
        html: 'El código enviado no es válido',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        backdrop: false
      });
    } else {
      if (mess == '#notificar' || mess == '#desnotificar') {
        http.Getconn(`MarcarNotificacion`, {
          id_meeting: ticketSelected?.conversation?.idConversation,
          id_user: loggedUser?.userInfo?.idUser,
          id_soporte: ticketSelected?.idTicket,
          marca: mess == '#notificar' ? '1' : '0'
        }).then((res) => {
          const result = JSON.parse(res);
          Swal.fire({
            title: result.code == '1' ? '!Buen trabajo!' : '!Info',
            html: result.message,
            icon: result.code == '1' ? 'success' : 'warning',
            confirmButtonText: 'Aceptar',
            reverseButtons: true,
            backdrop: false
          });
          refWrittenMessage.current.value = '';

          if (result.code == '1') {
            const samplePayload = {
              idConversation: ticketSelected?.conversation?.idConversation,
              value: '4',
              orderBy: false,
            };
            dispatch(updateTicket(samplePayload));
          }
        });
      } else if (mess == '#finalizar') {
        //TODO Llamar FinishDialog
      } else if (mess == '#escalar') {
        //TODO Llamar ScaleDialog
      }
    }
  };

  /*
    Se debe colocar en la función sendMessage() en parametro (message: any) para poder recibir el 
    mensaje y luego asignarlo al atributo content del objeto Message.
  */
  const sendMessage = (type: string, message: string) => {
    if (isconned) {
      if (message.charAt(0) === '#') {
        validateCommand(message);
        return;
      };

      var now = DateTime.now().toFormat('yyyy-MM-dd T:hh');
      const newMessage: MessageL = {
        idMessage: '-1',
        idConversation: ticketSelected?.conversation?.idConversation,
        createdDate: now,
        content: message,
        type: type,
        user: {
          userInfo: {
            idUser: loggedUser.userInfo.idUser,
            name: loggedUser.userInfo.name,
            lastName: '',
            photo: '',
            userType: '',
            servicePoint: '',
            userEncrypt: '',
            passwordEncrypt: ''
          },
          type: '0',
        },
        usersRead: [],
        eliminado: '',
        dateEliminado: null
      };
      connHub.invoke('HADS_SendMessage', newMessage)
        .done((res) => {
          dispatch(addMessagesSelected(newMessage));
          refWrittenMessage.current.value = '';
          setTimeout(() => {
            if (refPaper.current) refPaper.current.scrollTop = refPaper.current.scrollHeight;
          }, 100);

          var date = new Date().toString();
          const payload = {
            idConversation: newMessage.idConversation,
            value: '3',
            isAns: '1',
            dateAns: date,
          };
          dispatch(updateAns(payload));
          dispatch(addIdNewMessage(res.value.idMsg));
          if (ticketSelected.color != '') {
            dispatch(updateTicket({
              idConversation: ticketSelected?.conversation?.idConversation,
              color: 'rgb(2,7,41)'
            }));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setOpenModalAlert(true);
    }
  };

  useEffect(() => {
    const dragOverEvent = (event: any) => {
      if (!event?.target?.className?.includes('MuiDropzoneArea')) {
        setDragOver(false);
      }
    };

    document.addEventListener('dragover', dragOverEvent);
    return () => {
      document.removeEventListener('dragover', dragOverEvent);
    };
  }, []);

  useEffect(() => {
    setIsDragging(Dragging);
  }, [Dragging]);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    if (
      event.dataTransfer.types[0] == 'Files' ||
      isDragging == true
      // && document.getElementsByClassName('MuiDialog-container').length == 0
    ) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (ev: React.DragEvent<HTMLDivElement>): void => {
    setDragOver(false);
  };

  const handleChangeFile = async (event: any) => {
    if (event.length == 1) {
      if (event[0].size > 10000000) {
        setDragOver(false);
        setTextMessage(`Ha ocurrido un error.<br>Por favor adjunte un solo archivo a la vez <br> y tenga en cuenta que el 
        tamaño máximo admitido es de 4 MB`);
        setConfirmOpen(true);
        return;
      }
      try {
        dispatch(setLoadingWait(true));
        var formData = new window.FormData();
        formData.append('files[]', event[0]);
        formData.append('meeting', ticketSelected.conversation.idConversation);
        formData.append('idBpm', loggedUser.userInfo.idUser);
        formData.append('description', '_s');
        const data = await http.Postconn(`Upload`, formData);
        if (Array.isArray(data)) {
          setDragOver(false);
          sendMessage('a', JSON.stringify(data));
          dispatch(setLoadingWait(false));
        } else {
          setTextMessage(
            `Ha ocurrido un error al cargar su archivo. Intente nuevamente`
          );
          setConfirmOpen(true);
          dispatch(setLoadingWait(false));
          setDragOver(false);
        }
      } catch (error) {
        setTextMessage(
          `Ha ocurrido un error al cargar su archivo. Intente nuevamente`
        );
        setConfirmOpen(true);
        dispatch(setLoadingWait(false));
        setDragOver(false);
      }
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLElement>) => {
    if (0 == e.currentTarget.scrollTop && loading) {
      scrollHeightCurrent = refPaper.current.scrollHeight;
      pageMessage += 10;
      const { data } = await http.Getconn(`conversation/get_messages`, {
        idConversation: ticketSelected?.conversation?.idConversation,
        page: pageMessage,
      });
      if (data.length == 0) {
      }
      dispatch(addMessagesSelectedPaginate(data));
    }

    if (
      refPaper.current.offsetHeight + refPaper.current.scrollTop ==
      refPaper.current.scrollHeight
    ) {
      setShowEndConversation(false);
    } else {
      setShowEndConversation(true);
    }
  };

  /**
   * Valida el Scroll cuando se pagina
   */
  useEffect(() => {
    if (scrollHeightCurrent > 0) {
      refPaper.current.scrollTop =
        refPaper.current.scrollHeight - scrollHeightCurrent;
      scrollHeightCurrent = 0;
    }
  }, [messagesSelected.length]);

  useEffect(() => {
    if (refPaper.current != null && !showEndConversation) {
      setTimeout(() => {
        if (refPaper.current?.scrollHeight) {
          refPaper.current.scrollTop = refPaper.current?.scrollHeight;
        }
      }, 100);
    }
  }, [refPaper.current?.scrollHeight]);

  useEffect(() => {
    try {
      document.addEventListener('drop', (event: any) => {
        if (!event.target.className.toUpperCase().includes('MUIDROPZONEAREA')) {
          setDragOver(false);
        }
      });
    } catch (error) { }
  }, []);

  const getFileCopy = async (ev: any) => {
    if (isDragging) {
      var data = await GetFileCopy.getFile2Copy(ev, loggedUser, ticketSelected);
      if (Array.isArray(data)) {
        sendMessage('a', JSON.stringify(data));
        setDragOver(false);
        dispatch(setDragging(false));
      } else {
        setTextMessage(
          `Ha ocurrido un error al cargar su archivo. Intente nuevamente`
        );
        setDragOver(false);
        dispatch(setDragging(false));
      }
    }
  };

  return (
    <Grid item xs={columns} id={'controlChat'}>
      <Paper
        sx={{ height: '82.5vh', backgroundColor: '#90BD6E' }}
      >
        <Typography component="h2" style={{ paddingTop: '5px' }}>
          <SettingsEthernetIcon
            sx={{
              fontSize: 'x-large',
              float: 'left',
              cursor: 'pointer',
              color: '#FFFFFF',
              marginTop: '-1px',
              marginLeft: '9px'
            }}
            onClick={() => {
              ToggleWindowSize('ControlChat');
            }} />
          Chat
        </Typography>
        <Paper sx={{
          padding: 2,
          textAlign: 'center',
          color: 'text.secondary',
          height: '14vh',
          margin: '3px',
        }}>
          <Grid container spacing={3}
            sx={{
              textAlign: 'left',
              padding: '0px !important',
              margin: '0px !important'
            }}>
            <Grid item container md={8} xs={2}
              sx={{
                gridItem,
                borderRight: '2px solid #E9E9E9',
                paddingLeft: '10px !important',
                paddingTop: '3px !important'
              }}
            >
              <Grid item md={4} xs={3} sx={gridItem}>
                {'Solicitante :'}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <Tooltip title={ticketSelected?.user?.userInfo?.name}>
                  <Typography
                    noWrap
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'auto',
                    }}
                  >
                    {<strong>{ticketSelected?.user?.userInfo?.name}</strong>}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item md={4} xs={3} sx={gridItem}>
                {'Documento :'}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <strong>{ticketSelected?.user?.userInfo?.documentId}</strong>
              </Grid>
              <Grid item md={4} xs={3} sx={gridItem}>
                {'Proyecto :'}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <strong>{ticketSelected?.projectName}</strong>
              </Grid>
              <Grid item md={4} xs={3} sx={gridItem}>
                {'Fecha :'}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <strong>{ticketSelected?.createdDate}</strong>
              </Grid>
            </Grid>
            <Grid item container md={4} xs={3} style={{ alignItems: 'baseline', paddingTop: '0px' }}>
              <Grid item md={1} xs={3} sx={gridItem3}>
                <strong>{'TK '}</strong>
              </Grid>
              <Grid item md={9} xs={3}
                sx={{
                  textAlign: 'left',
                  fontSize: { xl: '25px', lg: '20px', md: '15px' },
                  marginLeft: '16px !important',
                  padding: '0px !important',
                  color: 'text.primary'
                }}>
                <strong>{ticketSelected?.idTicket}</strong>
              </Grid>
              <Grid item md={4} xs={3} sx={gridItem}>
                {'Tipo : '}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <Box
                  sx={{
                    //squareInt,
                    width: '85%',
                    fontSize: '8pt',
                    color: '#FFF',
                    borderRadius: '3px !important',
                    backgroundColor:
                      ticketSelected?.user?.userInfo?.userType == 'INTERNO'
                        ? '#008080'
                        : '#FF2727'
                  }}
                >
                  <strong>{ticketSelected?.user?.userInfo?.userType}</strong>
                </Box>
              </Grid>
              <Grid item
                md={4}
                xs={3}
                sx={{
                  padding: '0px !important',
                  margin: '0px !important',
                  textAlign: 'left',
                  fontSize: '9pt',
                  fontWeight: 'bold',
                  color: 'text.primary',
                  marginTop: '2px !important'
                }}>
                {'Sesión : '}
              </Grid>
              <Grid item md={8} xs={3} sx={gridItem}>
                <Box
                  sx={{
                    // squareLog,
                    width: '85%',
                    fontSize: '8pt',
                    color: '#FFF',
                    borderRadius: '3px !important',
                    backgroundColor:
                      ticketSelected?.loggedIn == '1'
                        ? '#A4A4A4'
                        : '#2F7ED5'
                  }}
                  style={{ marginTop: '2px !important' }}
                >
                  {ticketSelected?.loggedIn == '1' ? 'SIN LOGUEAR' : 'LOGUEADO'}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <>
          <Paper
            onDragEnter={handleDragEnter}
            sx={{
              margin: '3px',
              padding: 2,
              textAlign: 'center',
              color: 'text.secondary',
              //height: '60%',
              maxHeight: '49vh',
              overflow: 'auto',
              height: '50vh'
            }}
            ref={refPaper}
            onScrollCapture={handleScroll}
          >
            {messagesSelected.map((message, i) => {
              return (
                <ConversationMessage
                  className={'1'}
                  key={i}
                  message={message}
                  modulo={'ControlChat'}
                  themeMode={themeMode}
                />
              );
            })}
          </Paper>
          {dragOver ? (
            <div onDragLeave={handleDragLeave} onDrop={getFileCopy}>
              <DropZone
                handleChange={handleChangeFile}
                setDragOver={setDragOver}
                filesLimit={1}
              />
            </div>
          ) : (
            <Paper
              sx={{
                margin: '3px',
                color: 'text.secondary',
                height: '19.7%'
              }}
              onDragEnter={handleDragEnter}
            >
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridGap: 3
              }}>
                <div style={{ gridColumnEnd: 'span 11', height: '14.5vh' }}>
                  <TextField
                    id="txtMessageTicket"
                    fullWidth={true}
                    sx={{
                      marginLeft: 1,
                      flex: 1,
                      width: '100%',
                      float: 'left',
                      '& .MuiOutlinedInput-root': {
                        padding: '1.5px 14px !important',
                      },
                      '& .MuiOutlinedInput-input': {
                        height: '107px',
                        maxHeight: '110px',
                        overflow: 'inherit !important',
                        paddingTop: '5px'
                      }
                    }}
                    placeholder="Escriba su mensaje"
                    minRows={5}
                    inputRef={refWrittenMessage}
                    multiline
                    onPaste={(event) => {
                      handleChangeFile(event.clipboardData.files);
                    }}
                    inputProps={{ 'aria-label': 'Escriba su mensaje' }}
                    onKeyDown={(e) => {
                      if(!isconned){
                        setOpenModalAlert(true);
                      }else{
                        const keyShift = e.shiftKey;
                        if (e.key === 'Enter' && keyShift === false) {
                          e.preventDefault();
                          if (refWrittenMessage.current.value.length >= 1) {
                            e.preventDefault();
                            sendMessage(
                              't',
                              refWrittenMessage.current.value
                            );
                          }else{
                            refWrittenMessage.current.value = '';
                          }
                        }
                      }
                    }
                    }
                  />
                </div>
                <div style={{ gridColumnEnd: 'span 1' }}>
                  <Tooltip title="Enviar mensaje">
                    <IconButton
                      type="submit"
                      sx={{ width: '10px', height: '10px' }}
                      aria-label="send"
                      onClick={() => {
                        if (refWrittenMessage.current.value.length > 0) {
                          sendMessage('t', refWrittenMessage.current.value);
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Tooltip>

                  <UpLoadFile
                    onChangeFile={handleChangeFile}
                    setDragOver={setDragOver}
                  />

                  <OptionsConversations
                    handleOpenModalStickyNotes={() => {
                      setOpenModalStickyNotes(true);
                    }}
                    handleOpenAddUserModal={() => {
                      setOpenAddUsuModal(true);
                    }}
                    callbackPage={(textSticky: string) => {
                      refWrittenMessage.current.value = textSticky;
                    }}
                  />
                  {showEndConversation && (
                    <Tooltip title="Fin conversación">
                      <IconButton
                        type="submit"
                        sx={{ width: '10px', height: '10px' }}
                        aria-label="send"
                        onClick={() => {
                          if (refPaper.current) {
                            scrollHeightCurrent = 0;
                            refPaper.current.scrollTop =
                              refPaper?.current?.scrollHeight;
                          }
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </Box>
            </Paper>
          )}
        </>
      </Paper>
      <AlertDialog
        open={openModalAlert}
        setOpenModal={setOpenModalAlert}
        title={'Usuario Desconectado'}
        message={`No es posible enviar mensajes debido a que se ha detectado que la sesión activa ha sido desconectada, 
        por favor recargue la página (F5) o inicie sesión nuevamente.`}
      />
      {confirmOpen && (
        <ConfirmDialog
          title="Atención:"
          open={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            setDragOver(false);
          }}
          close={true}
          textButton={'Aceptar'}
          severity={'warning'}
        >
          {textMessage}
        </ConfirmDialog>
      )}
    </Grid>
  );
};

interface ControlChatProps {
  container: any,
  store: any
}

export const ControlChat = (props: ControlChatProps) => {
  const {
    container,
    store
  } = props;

  const {
    messageInformation,
    loggedUser,
    ticketSelected,
    ticketSelectedProject,
  } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const [openModalStickyNotes, setOpenModalStickyNotes] = useState(false);
  const [openModalStickyNotesRenderFirst, setOpenModalStickyNotesRenderFirst] =
    useState(true);
  const [openAddUsuModal, setOpenAddUsuModal] = useState(false);
  const [openModalStickyNotesV3, setOpenModalStickyNotesV3] = useState(false);
  const [windowsSticky, setWindowsSticky] = React.useState<null[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [colControlChat, setColControlChat] = useState(5);
  const [colGroupChat, setColGroupChat] = useState(5);


  const ToggleWindowSize = (idChat: string) => {

    if (idChat == 'ControlChat') {
      if (7 !== colControlChat) {
        setColControlChat(7);
        setColGroupChat(3);
      } else {
        setColControlChat(5);
        setColGroupChat(5);
      }
    } else {
      if (7 !== colGroupChat) {
        setColControlChat(3);
        setColGroupChat(7);
      } else {
        setColControlChat(5);
        setColGroupChat(5);
      }
    }
  };

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      mode === 'dark'
        ? createTheme(darkTheme)
        : createTheme({
          palette: {
            mode: mode,
          },
        }),
    [mode]
  );

  //Metodo para cambiar el color del contenedor principal
  useEffect(() => {
    let element = document.getElementsByClassName('contentViewer visorPI');
    mode === 'dark'
      ? (element[0].style.backgroundColor = theme.palette.background.default)
      : (element[0].style.backgroundColor = '#E9ECEF');
  }, [mode]);

  const inputOptions = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dark: 'Modo Oscuro',
        light: 'Modo Claro',
      });
    }, 1000);
  });

  const addThemeUser = (idUser: string, theme: string) => {
    const fetchData = async () => {
      try {
        const { data } = await https.PostHADS(`users/theme`, {
          idUser: idUser,
          theme: theme,
        });
        theme === 'dark' ? setMode('dark') : setMode('light');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const setUpTheme = async () => {
    const { value: theme } = await Swal.fire({
      title: 'Selecciona el tema de tu preferencia',
      backdrop: false,
      allowOutsideClick: false,
      icon: 'info',
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return 'Necesitas elegir un tema!';
        }
      },
    });

    if (theme) {
      addThemeUser(loggedUser.userInfo.idUser, theme);
    }
  };

  useEffect(() => {
    if (loggedUser.userInfo?.theme != '') {
      let theme = loggedUser.userInfo.theme;
      theme === 'dark' ? setMode('dark') : setMode('light');
    } else if (loggedUser.userInfo?.idUser != '') {
      setTimeout(() => {
        setUpTheme();
      }, 20000);
    }
  }, [loggedUser?.userInfo]);

  const refWrittenMessage = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (windowsSticky.length > 0) {
      window.addEventListener('unload', function () {
        setOpenModalStickyNotesV3(false);
        setWindowsSticky([]);
      });
    }
  }, [windowsSticky]);

  useEffect(() => {
    if (loggedUser.userInfo.idUser) {
      const fetchData = async () => {
        try {
          dispatch(setLoadingWait(true));
          const { data } = await http.GetHADS(
            `StickyNotes/perfil/${loggedUser.userInfo.idUser}`
          );
          data == '1' ? setHasProfile(true) : setHasProfile(false);
          dispatch(setLoadingWait(false));
        } catch (error) {
          dispatch(setLoadingWait(false));
        }
      };
      fetchData();
    }
  }, [loggedUser?.userInfo]);

  React.useEffect(() => {
    if (loggedUser != undefined && loggedUser.products.length > 0) {
      let obj = {
        idProject: loggedUser.products[0].projects[0].idProject,
        name: loggedUser.products[0].projects[0].name,
        conversation: {
          idConversation:
            loggedUser.products[0].projects[0].conversation.idConversation,
        },
      };
      dispatch(setTicketSelectedProject(obj));
    }
  }, [loggedUser.products.length]);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {
          ReactDOM.render(
            <Provider store={store}>
              <ControlPanel themeMode={mode} />
            </Provider>,
            container
          )
        }
        <Box sx={{
          margin: 0.5,
          flexGrow: 1,
          height: '92vh',
        }}>
          <SharedScreen />
          <Grid container spacing={1}>
            <Grid item xs={2}>
              {loggedUser.products.length > 0 && (
                <TreeChatGroups themeMode={mode} />
              )}
            </Grid>
            {ticketSelectedProject && (
              <ChatProject
                key={ticketSelectedProject.idProject}
                themeMode={mode}
                columns={colGroupChat}
              />
            )}
            {ticketSelected && (
              <ControlChatRender
                refWrittenMessage={refWrittenMessage}
                key={ticketSelected?.idTicket}
                setOpenModalStickyNotes={setOpenModalStickyNotes}
                setOpenAddUsuModal={setOpenAddUsuModal}
                themeMode={mode}
                columns={colControlChat}
                ToggleWindowSize={ToggleWindowSize}
              />
            )}
            <Grid item xs={colGroupChat} sx={gridTools} id={'toolbar'}>
              {ticketSelected && (
                <ToolBar
                  setWindowsSticky={setWindowsSticky}
                  setOpenModalStickyNotesV3={setOpenModalStickyNotesV3}
                  openModalStickyNotesV3={openModalStickyNotesV3}
                  windowsSticky={windowsSticky}
                  colorMode={colorMode}
                  setMode={setMode}
                  mode={mode}
                />
              )}
            </Grid>
            <Grid item xs={colControlChat} sx={gridTools} id={'tkcontrol'}>
              {ticketSelected && <TicketControls hasProfile={hasProfile} />}
            </Grid>
          </Grid>
          {messageInformation.isVisible && <AlertMessage />}
          <div>
            {openModalStickyNotes && (
              <StickyNotesDialogInternal
                open={openModalStickyNotes}
                setOpenModalStickyNotes={setOpenModalStickyNotes}
                callbackPage={(textSticky: string) => {
                  refWrittenMessage.current.value = textSticky;
                }}
              />
            )}
            {openModalStickyNotesRenderFirst && (
              <StickyNotesDialogRenderFirst
                open={openModalStickyNotesRenderFirst}
                setOpenModalStickyNotes={setOpenModalStickyNotesRenderFirst}
                callbackPage={(textSticky: string) => {
                  refWrittenMessage.current.value = textSticky;
                }}
              />
            )}
            {openAddUsuModal && (
              <AddUserConv
                open={openAddUsuModal}
                setOpenModal={setOpenAddUsuModal}
              />
            )}
          </div>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
