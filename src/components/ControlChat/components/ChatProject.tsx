import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import {Box} from '@mui/material'
import connHub from 'connHub';
import { DateTime } from "luxon";
import AlertDialog from './modal/AlertDialog';
import * as _ from 'lodash';
import { MessageL } from 'utils/HADSObjectsLocal';
import http from 'mixins/https';
import {
  addMessagesSelectedProject,
  addMessagesSelectedProjectPaginate,
  setUsersConversationProject,
  setMessagesSelectedProject,
  setLoadingWait,
  setDragging,
} from 'slices/app';
import { useDispatch } from 'react-redux';
import ConversationMessage from './ConversationMessage';
import DropZone from 'utils/DropZone';
import ConfirmDialog from 'utils/ConfirmDialog';
import OptionsButtonChatProject from '../../OptionsButtonChatProject';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UpLoadFile from 'components/global/buttons/UpLoadFile';
import GetFileCopy from 'utils/GetFileCopy';

import {
  Paper,
  TextField,
  Grid,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'slices';

const gridItemTittle={
  padding: '0px !important',
  margin: '0px !important',
  fontSize: '9pt',
  fontWeight: 'bold',
  color: 'text.primary',
  borderRight: '1px solid #E9E9E9',
  textAlign: 'center'
}as const;

const gridItem={
  textAlign: 'left',
  fontSize: '9pt',
  padding: '0px !important',
  marginLeft: '2px !important',
  color: 'text.primary',
}as const;


interface ChatProjectProps {
  themeMode: string;
  columns: number;
}

const ChatProject = (props: ChatProjectProps) => {
  const { themeMode, columns } = props;
  const refWrittenMessage = useRef<HTMLInputElement>(null);

  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [showEndConversation, setShowEndConversation] = useState(false);
  const isconned = useSelector((state) => state.connHub.isconned);
  const {
    loggedUser,
    messagesSelectedProject,
    projectSelected,
    ticketSelectedProject,
    Dragging,
  } = useSelector((state) => state.app);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState('');

  const dispatch = useDispatch();

  const refPaperProject = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPage({
      ...page,
      pos: 0,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!showEndConversation && refPaperProject.current != null) {
        refPaperProject.current.scrollTop =
          refPaperProject.current.scrollHeight + 500;
      }
    }, 500);
  }, [messagesSelectedProject, dragOver]);

  const [timeLeft, setTimeLeft] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const sendMessageProject = (type: string, message: string) => {
    if(refWrittenMessage.current.value = '' && message == '') return;
    if (isconned) {
      var now = DateTime.now().toFormat('yyyy-MM-dd T:hh');//moment().format('YYYY-MM-DDTHH:mm:ss');
      const newMessageProject: MessageL = {
        idMessage: '-1',
        idConversation: ticketSelectedProject.conversation.idConversation,
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
      connHub.invoke('HADS_SendMessageGroup', newMessageProject)
        .done((res) => {
          dispatch(addMessagesSelectedProject(newMessageProject));
          refWrittenMessage.current.value = '';
          dispatch(setLoadingWait(false));
          setTimeout(() => {
            refPaperProject.current.scrollTop =
              refPaperProject.current.scrollHeight + 500;
          }, 100);
        })
        .catch((err) => {
          console.error(err);
          dispatch(setLoadingWait(false));
        });
    } else {
      refWrittenMessage.current.value = '';
      setOpenModalAlert(true);
    }
  };

  useEffect(() => {
    const dragOverEvent = (event: any) => {
      const className = event.target?.className;
      if (className) {
        !event.target?.className?.includes('MuiDropzoneArea')
          ? setDragOver(false)
          : -1;
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
        formData.append(
          'meeting',
          ticketSelectedProject.conversation.idConversation
        );
        formData.append('idBpm', loggedUser.userInfo.idUser);
        formData.append('description', '_s');

        const data = await http.Postconn(`Upload`, formData);

        if (Array.isArray(data)) {
          setDragOver(false);
          sendMessageProject('a', JSON.stringify(data));
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

  const handleScroll = (e: React.UIEvent<HTMLElement>): void => {
    if (0 == e.currentTarget.scrollTop && loading) {
      setPage({
        ...page,
        pos: page.pos + 10,
      });
    }

    if (
      refPaperProject.current.offsetHeight +
        refPaperProject.current.scrollTop >=
      refPaperProject.current.scrollHeight
    ) {
      setShowEndConversation(false);
    } else {
      setShowEndConversation(true);
    }
  };

  useEffect(() => {
    if (isconned) {
      if (page != null) {
        try {
          connHub.invoke(
            'GetConversationMessagesProject',
            ticketSelectedProject.conversation.idConversation,
            page.pos
          )
            .done((res) => {
              if (res.messages.length == 0) {
              }
              let scrollHeight = refPaperProject.current.scrollHeight;

              if (res.users.length > 0) {
                dispatch(setUsersConversationProject(res.users));
              }
              if (0 == page.pos) {
                dispatch(setMessagesSelectedProject(res.messages));
              } else {
                dispatch(addMessagesSelectedProjectPaginate(res.messages));
              }

              refPaperProject.current.scrollTop =
                refPaperProject.current.scrollHeight - scrollHeight;
            })
            .catch((err) => {
              dispatch(setLoadingWait(false));
              console.error(err);
            });
        } catch (error) {
          dispatch(setLoadingWait(false));
        }
      }
    }
  }, [page, isconned]);

  useEffect(() => {
    try {
      document.addEventListener('drop', (event: any) => {
        if (!event.target.className.toUpperCase().includes('MUIDROPZONEAREA')) {
          setDragOver(false);
        }
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    dispatch(setLoadingWait(true));
    setPage({
      ...page,
      pos: 0,
    });
    setLoading(true);
    setShowEndConversation(false);
  }, [ticketSelectedProject?.conversation.idConversation]);

  const getFileCopy = async (ev: any) => {
    if (isDragging) {
      var data = await GetFileCopy.getFile2Copy(
        ev,
        loggedUser,
        ticketSelectedProject
      );
      if (Array.isArray(data)) {
        sendMessageProject('a', JSON.stringify(data));
        setDragOver(false);
        dispatch(setDragging(false));
      } else {
        setDragOver(false);
        dispatch(setDragging(false));
      }
    }
  };

  return (
    <Grid item xs={columns} id={'groupChat'}>
      <Paper
        sx={{height: '82.5vh', backgroundColor: themeMode === 'dark' ? '#4F94C8': 'primary.main' }}
      >
        <Typography component="h2" style={{ paddingTop: '5px' }}>
          Chat grupal
        </Typography>
        <Paper sx={{
          margin: '3px',
          padding: 2,
          textAlign: 'center',
          color: 'text.secondary',
          height: '14vh',
        }}>
          {projectSelected && (
            <Grid container spacing={3} sx={{textAlign: 'left', padding: '0px !important', margin: '0px !important',}}>
              <Grid
                item
                md={2}
                xs={3}
                sx={gridItemTittle}
              >
              </Grid>
              <Grid
                item
                container
                md={9}
                xs={3}
                sx={{
                  textAlign: 'left',
                  paddingLeft: '10px !important'
                }}
              >
                <Grid item md={5} xs={3} sx={gridItemTittle}>
                  {'Proyecto : '}
                </Grid>
                <Grid item md={5} xs={3} sx={gridItem}>
                  <strong>
                    {projectSelected.nameProduct}{ticketSelectedProject.name}
                  </strong>
                </Grid>
                <Grid item md={5} xs={3} sx={gridItemTittle}>
                  {'Usuarios : '}
                </Grid>
                <Grid item md={6} xs={3} sx={gridItem}>
                  <Typography
                    noWrap
                    sx={gridItem}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'auto',
                    }}
                  >
                    {ticketSelectedProject?.conversation.users &&
                      ticketSelectedProject?.conversation.users.map(
                        (user: any, i) => {
                          return (
                            <strong key={i}>
                              {user.name} {user.lastName},
                            </strong>
                          );
                        }
                      )}
                  </Typography>
                </Grid>
                <Grid item md={2} xs={3}>
                  <OptionsButtonChatProject></OptionsButtonChatProject>
                </Grid>
              </Grid>
              <Grid item md={1} xs={3} sx={gridItem}>
                {/* <OptionsButtonChatProject></OptionsButtonChatProject> */}
              </Grid>
            </Grid>
          )}
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
          <div>
            <Paper
              onDragEnter={handleDragEnter}
              onMouseLeave={(event) => {
                setDragOver(false);
              }}
              onMouseEnter={() => {
                setDragOver(false);
              }}
              sx={{
                margin: '3px',
                padding: 2,
                textAlign: 'center',
                color: 'text.secondary',
                backgroundColor: 'background.paper',
                height: '60%'
              }}
              style={{ maxHeight: '49vh', overflow: 'auto', height: '50vh' }}
              ref={refPaperProject}
              onScroll={handleScroll}
            >
              {messagesSelectedProject.map((message, i) => {
                return (
                  <ConversationMessage
                    className={'1'}
                    key={i}
                    message={message}
                    modulo={'ControlChat'}
                    isGroup={true}
                    themeMode={themeMode}
                  />
                );
              })}
            </Paper>
            <Paper
              sx={{
                color: 'text.secondary',
                height: '19.7%',
                margin: '3px',
              }}
              onDragEnter={handleDragEnter}
              onDragEnd={() => {
                setDragOver(false);
              }}
              onMouseLeave={(event) => {
                setDragOver(false);
              }}
              onMouseEnter={() => {
                setDragOver(false);
              }}
            >
              <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridGap: 3,}}>
                <div style={{ gridColumnEnd: 'span 11', height: '14.5vh' }} id={'iconsCht'}>
                  <TextField
                    id="txtMessageTicketProject"
                    fullWidth={true}
                    sx={{
                      marginLeft: 1,
                      flex: 1,
                      width: '100%',
                      '& .MuiOutlinedInput-root' : {
                        padding: '1.5px 14px !important',
                       },
                       '& .MuiOutlinedInput-input' : {
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
                    onChange={(e) =>
                      (refWrittenMessage.current.value = e.target.value)
                    }
                    onKeyDown={(e) => {
                      if(!isconned){
                        setOpenModalAlert(true);
                      }else{
                        const keyShift = e.shiftKey;
                        if (e.key === 'Enter' && keyShift === false) {
                          e.preventDefault();
                          if (refWrittenMessage.current.value.length >= 1) {
                            e.preventDefault();
                            sendMessageProject(
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
                <Grid
                  style={{
                    gridColumnEnd: 'span 1',
                    marginLeft: '11px',
                    marginRight: '11px',
                  }} id={'iconsGrp'}
                >
                  <IconButton
                    type="submit"
                    sx={{ width: '10px', height: '10px'}}
                    aria-label="send"
                    onClick={() => {
                      sendMessageProject('t', refWrittenMessage.current.value);
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                  <UpLoadFile
                    onChangeFile={handleChangeFile}
                    setDragOver={setDragOver}
                  />
                  {showEndConversation && (
                    <Tooltip title="Fin conversación">
                      <IconButton
                        type="submit"
                        sx={{ width: '10px', height: '10px' }}
                        aria-label="send"
                        onClick={() => {
                          if (refPaperProject.current) {
                            refPaperProject.current.scrollTop =
                              refPaperProject?.current?.scrollHeight;
                          }
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Box>
            </Paper>
          </div>
        )}
      </Paper>
      <AlertDialog
        open={openModalAlert}
        setOpenModal={setOpenModalAlert}
        title={'Usuario Desconectado'}
        message={`No es posible enviar mensajes debido a que se ha detectado que la sesión activa ha sido 
        desconectada, por favor recargue la página (F5) o inicie sesión nuevamente.`}
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
export default ChatProject;
