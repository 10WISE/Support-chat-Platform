import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, List, IconButton, Tooltip, Theme, Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useSelector } from 'slices';
import validateMessage from 'utils/validateMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import UserReadMessages from './modal/UserReadMessages';
import ViewImages from 'utils/ViewImages';
import Swal from 'sweetalert2';
import https from 'mixins/https';
import { MessageL } from 'utils/HADSObjectsLocal';
import { setDragging, setMessagesSelected } from 'slices/app';

const tittleNameUser= {
  fontSize: '9pt !important',
  padding: '0px !important',
  margin: '0px !important',
  fontWeight: 'bold'
} as const;

const root = {
  marginBottom: 2
}as const;

const authUser = {
  display: 'flex',
    justifyContent: 'flex-end',
    '& $body': {
      backgroundColor: '#3953B5',
      color: 'text.primary',
    },
} as const;

interface ConversationMessageProps {
  className: string;
  message: MessageL;
  modulo?: string;
  isGroup?: boolean;
  themeMode?: string;
}

const ConversationMessage = (props: ConversationMessageProps) => {
  const { message, className, isGroup, themeMode, ...rest } = props;
  const [openUser, setOpenUser] = useState(false);
  const [openViewImage, setOpenViewImage] = useState(false);
  const [urlImage, setUrlImage] = useState('');
  const [users, setUsers] = useState<MessageL.UserRead[]>([]);
  const { loggedUser, ticketSelected, messagesSelected } = useSelector(
    (state) => state.app
  );
  const [lastMessage, setLastMessage] = useState(false);
  const dispatch = useDispatch();

  var valueNameChat;
  try {
    if (loggedUser.userInfo.idUser == message.user.userInfo.idUser) {
      valueNameChat = 'Sophia';
    } else if (message.user.type == '') {
      valueNameChat = 'Sophia';
    } else if (message.user.userInfo.name == 'noSession') {
      valueNameChat = ticketSelected.user.userInfo.name;
    } else if (message.user.type == 'True') {
        valueNameChat = message.user.userInfo.name;
    } else {
        valueNameChat = message.user.userInfo.name;
    }
    
  } catch (error) {
    console.error(error);
  }

  if (isGroup) {
    if (loggedUser.userInfo.idUser == message.user.userInfo.idUser) {
      valueNameChat = 'Yo';
    } else {
      valueNameChat = message.user.userInfo.name.toLocaleUpperCase();
    }
  }

  let isFilePdf = false;
  let nameFile = 'Sin Imagen';
  let mime = '';
  if (message.type === 'a') {
    try {
      if (message.content.trim()) {
        mime = JSON.parse(message.content)[0].mime;
        nameFile = JSON.parse(message.content)[0].v;

        if (mime?.includes('image')) {
          isFilePdf = false;
        } else {
          isFilePdf = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  let color: string;
  try {
    if (message.type.toUpperCase() == 'S') {
      var valMessage = validateMessage(message.content, 100);
      if (typeof valMessage == 'object') {
        color = valMessage.color;
      } else {
        color = 'rgb(64, 193, 135)';
      }
    }else{
      color = valueNameChat == 'Sophia' ? '#FFF': valueNameChat == 'Yo' ? '#FFF' : themeMode == 'dark' ? '#FFF' : '#101010' ;
    }
  } catch (error) {}

  const updateMessages = async () => {
    try {
      const { data } = await https.GetConnect(`conversation/get_messages`, {
        idConversation: ticketSelected.conversation.idConversation,
        page: 0,
      });
      dispatch(setMessagesSelected(data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = (message: MessageL) => {
    let confirm = '';
    let nameFile = '';
    if (message.type === 'a') {
      confirm = 'Archivo';
      nameFile = '';
    } else {
      confirm = 'Mensaje';
      nameFile = `${message.content.substring(0, 5)}...`;
    }
    Swal.fire({
      title: `Desea eliminar?`,
      text: `${confirm}: ${nameFile}`,
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      backdrop: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(message);
      }
    });
  };

  const confirmDelete = (message: MessageL) => {
    const fetchData = async () => {
      try {
        const { data } = await https.PostConnect(`delete_message`, {
          idConversation: message.idConversation,
          idMessage: message.idMessage,
          userElimina: loggedUser.userInfo.idUser,
        });
        updateMessages();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  useEffect(() => {
    validateLastMessage(message);
  }, [messagesSelected]);

  const validateLastMessage = (message: MessageL) => {
    setLastMessage(false);
    var numElems = messagesSelected.length;
    messagesSelected.forEach(function (item, i) {
      if (i == numElems - 1) {
        item.idMessage == message.idMessage && setLastMessage(true);
      }
    });
  };

  const dragStart = (event: any) => {
    const file = event.target.getAttribute('src').replace(/^.*[\\\/]/, '');
    const name = event.target.getAttribute('id');
    const eventName = event.target.getAttribute('key');
    event.dataTransfer.setData('text', file);
    event.dataTransfer.setData('name', name);
    event.dataTransfer.setData('key', eventName);
    dispatch(setDragging(true));
  };

  return (
    <Box
      sx={ valueNameChat == 'Sophia' ||  valueNameChat === 'Yo' ? authUser : root}
    >
      <Box
        sx={{
          display: 'flex',
          maxWidth: 500,
          textAlign: 'left'
        }}
      >
        <>
          <Box sx={{
            backgroundColor: valueNameChat === 'Sophia' || valueNameChat === 'Yo' ? '#3953B5' 
                           : themeMode === 'dark' ? '#1e2964'
                           : themeMode === 'light' && '#eeeeee',
            color: 'text.primary',
            borderRadius: '4px',
            padding: 1,
          }}>
            <>
              <Typography
                //variant="h6"
                sx={{tittleNameUser, 
                  color: themeMode === 'dark' && valueNameChat !== 'Sophia'? '#FFF'
                       : themeMode === 'light' && valueNameChat !== 'Sophia' ? '#101010'
                       : '#52C748', 
                  fontSize: '12px' }}
              >
                {valueNameChat}
                {valueNameChat === 'Sophia' &&
                  message.eliminado !== '1' &&
                  message.type != 's' &&
                  ticketSelected?.user?.userInfo?.userType == 'EXTERNO' &&
                  lastMessage == true && (
                    <DeleteIcon
                      sx={{
                        float: 'right',
                        color: '#3953B5',
                        '&:hover': {
                          color: '#d1d5d2',
                        }
                      }}
                      fontSize="small"
                      onClick={() => handleDeleteMessage(message)}
                      cursor="pointer"
                    />
                  )}
              </Typography>
            </div>
            <Box sx={{
                padding: '0px !important',
                margin: '0px !important',
                width: '100%'
              }}>
              <Typography color="inherit">
                {message.type === 'a' ? (
                  message.eliminado == '1' ? (
                    <span
                      key={message.idMessage}
                      style={{ color: color, fontSize: 'small' }}
                    >
                      {<Typography component={'i'} sx={{color: '#a7a1a1'}}>mensaje eliminado</Typography>}
                      {/* <br /> */}
                    </span>
                  ) : isFilePdf ? (
                    <Tooltip title="Descargar Archivo">
                      <IconButton
                        type="submit"
                        sx={{padding: 1}}
                        aria-label="send"
                        onClick={() => {
                          try {
                            window.open(JSON.parse(message.content)[0].url);
                          } catch (e) {}
                        }}
                      >
                        <DescriptionIcon />
                        <Typography
                          color="inherit"
                          variant="h6"
                          sx={tittleNameUser}
                        >
                          {nameFile}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Ver Imagen">
                      <IconButton
                        type="submit"
                        aria-label="send"
                        onClick={() => {
                          setOpenViewImage(true);
                          try {
                            setUrlImage(JSON.parse(message.content)[0].url);
                          } catch (error) {}
                        }}
                      >
                        <Typography
                          color="inherit"
                          variant="h6"
                          sx={tittleNameUser}
                        >
                          {nameFile}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  )
                ) : (
                  <Typography
                    component={'span'}
                    display={'inline'}
                    color={'inherit'}
                    variant={'body1'}
                    sx={{
                      fontSize: '9pt !important',
                      marginTop: '0px !important',
                      fontWeight: 'normal'
                    }}
                  >
                    {message.eliminado == '1' ? (
                      <span key={message.idMessage} style={{ color: color }}>
                        {<Typography component={'i'} sx={{color: '#a7a1a1'}}>mensaje eliminado</Typography>}
                        {/* <br /> */}
                      </span>
                    ) : (
                      message.content.split('\n').map((i, key) => {
                        if (i != '') {
                          return (
                            <>
                              {i}
                            </>
                          );
                        }
                      })
                    )}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>
          <Box sx={{
            marginTop: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '8pt !important'
            }}>
            <Box sx={{
              marginLeft: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
              }}>
              <List style={{ padding: 0 }}>{message.createdDate}</List>
            </Box>
          </Box>
        </>
      </Box>
      {users.length > 0 && (
        <UserReadMessages
          users={users}
          setOpenUser={setOpenUser}
          openUser={openUser}
        />
      )}
      {openViewImage && (
        <ViewImages
          open={openViewImage}
          setOpenModal={setOpenViewImage}
          url={urlImage}
        />
      )}
    </Box>
  );
};

export default ConversationMessage;
