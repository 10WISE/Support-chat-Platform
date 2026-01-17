import * as React from 'react';
import Draggable from 'react-draggable';
import {
  ThemeProvider
} from '@mui/styles';
import {createTheme} from '@mui/material'
import ConnectHub from 'ConnectHub';
import { MessageShareScreen } from 'utils/HADSObjectsLocal';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'slices';
import { setShareOnline } from 'slices/app';
import { green } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';

import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Zoom,
  Tooltip,
  Fab,
} from '@mui/material';

import ProgressCircular from 'utils/ProgressCircular';
import ConfirmDialog from 'utils/ConfirmDialog';


const muiTheme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
      root: {
        //position: 'initial !important',
        inset: 'initial !important',
        display: 'contents',
      },
      container: {
        height: 'auto',
      },
    }
    },
    MuiBackdrop: {
      styleOverrides:{
      root: {
        top: 'initial !important',
        left: 'initial !important',
      },
    }
    },
  },
});

const PaperComponent = (props: any) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds={'body'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

let localConnection: RTCPeerConnection;
let idCallee: string;
let onCall: boolean;


const SharedScreen = () => {

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dataMessage, setDataMessage] = React.useState<MessageShareScreen>();
  const [sender, setSender] = React.useState('');
  const [open, setOpenModal] = useState(false);
  const [Progress, setProgress] = React.useState(false);
  const [closeFab, setCloseFab] = React.useState(false);

  const dispatch = useDispatch();

  const refElement = React.useRef(null);
  const refDialog = React.useRef(null);

  const isConnected = useSelector((state) => state.connectHub.isConnected);

  React.useEffect(() => {
    const cbHADS_ShareScreen = (data: any, sender: string) => {
      let configuration = {
        iceServers: [
          {
            urls: ['stun:turn.syc.com.co'],
          },
          {
            urls: ['turn:turn.syc.com.co:80?transport=tcp'],
            username: '3b9f5824',
            credential: '9c36a9958a68',
          },
        ],
      };
      localConnection = new RTCPeerConnection(configuration);
      setDataMessage(data);
      setSender(sender);

      if (data.messageType == 'screen') {
        setConfirmOpen(true);
      }
    };

    const cbHADS_EndShared = (res: any) => {
      dispatch(setShareOnline(null));
      setOpenModal(false);
      setCloseFab(false);
    };

    if (isConnected) {
      ConnectHub.on('HADS_ShareScreen', cbHADS_ShareScreen);
      ConnectHub.on('HADS_EndShared', cbHADS_EndShared);
    }
    return () => {
      ConnectHub.off('HADS_ShareScreen', cbHADS_ShareScreen);
      ConnectHub.off('HADS_EndShared', cbHADS_EndShared);
    };
  }, [isConnected]);

  React.useEffect(() => {
    const cbOnCandidate = (candidate: any) => {
      localConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    ConnectHub.on('onCandidate', cbOnCandidate);
    return () => {
      ConnectHub.off('onCandidate', cbOnCandidate);
    };
  }, []);

  React.useEffect(() => {
    const cb = (offer: any, sender: any) => {
      setSender(sender);
      idCallee = sender;

      onCall = true;

      localConnection.setRemoteDescription(new RTCSessionDescription(offer));

      localConnection
        .createAnswer()
        .then((answer) => {
          return localConnection.setLocalDescription(answer);
        })
        .then(() => {
          ConnectHub.invoke(
            'sendAnswer',
            sender,
            localConnection.localDescription
          ).fail((err) => {
            console.error(err);
          });
        })
        .catch((err) => {
          console.error(err, 'sendAnswer');
        });
    };
    ConnectHub.on('onOffer', cb);

    return () => {
      ConnectHub.off('onOffer', cb);
    };
  }, []);

  React.useEffect(() => {
    if (localConnection) {
      localConnection.onicecandidateerror = (event) => {};
      // Acá esta la respuesta magica de WebRTC
      localConnection.ontrack = (event) => {
        setProgress(false);
        setCloseFab(true);
        setOpenModal(true);
        dispatch(setShareOnline(dataMessage.idConversation));
        refElement.current.srcObject = event.streams[0];
        for (
          let index = 0;
          index < document.getElementsByClassName('MuiDialog-container').length;
          index++
        ) {}
      };

      localConnection.onicecandidate = (evt) => {
        if (evt.candidate) {
          ConnectHub.invoke('sendCandidate', sender, evt.candidate).fail(
            (err) => {
              console.error(err, 'sendCandidate');
            }
          );
        }
      };

      localConnection.oniceconnectionstatechange = (event: any) => {
        if (event.currentTarget.iceConnectionState == 'disconnected') {
          dispatch(setShareOnline(null));
          setOpenModal(false);
          setCloseFab(false);
        }
      };
    }
  }, [isConnected, sender, localConnection]);

  const handleConfirm = async () => {
    setProgress(true);
    var obj = {
      type: 'response',
      value: true,
      m: dataMessage.idConversation,
    };
    ConnectHub.invoke('SendMessage', sender, obj)
      .done((res) => {})
      .catch((err) => {
        console.error('se estalló', err);
      });
  };

  const handleCancel = () => {
    // Se cancela el compartir pantalla
    var obj = {
      type: 'cancel',
      value: false,
      m: dataMessage.idConversation,
    };
    setConfirmOpen(false);

    ConnectHub.invoke('SendMessage', sender, obj)
      .done((res) => {})
      .catch((err) => {
        console.error('se estalló', err);
      });
  };

  const handleEndScreen = () => {
    setProgress(true);
    ConnectHub.invoke('hangup', dataMessage.idConversation, 'int')
      .done((res) => {
        setCloseFab(false);
        setProgress(false);
        setOpenModal(false);
        dispatch(setShareOnline(null));
      })
      .fail(function (err) {
        console.error('Error:: hangup', err);
      });
  };


  const fabs = [
    {
      color: 'inherit' as 'inherit',
      //classFans: clsx(classes.fab, classes.fabGreen, classes.classFlicker),
      icon: <CallIcon />,
      label: 'Renaudar',
    },
  ];

  /**
   * Codigo para probar la coptura d ela misma pantalla
   */
  const startRecording = async () => {
    const mediaDevices = navigator.mediaDevices as any;
    const stream = await mediaDevices.getDisplayMedia();
    refElement.current.srcObject = stream;
  };

  useEffect(() => {
    setTimeout(() => {
      // startRecording();
    }, 15000);
  }, []);

  return (
    <div>
      {open && (
        <ThemeProvider theme={muiTheme}>
          <Dialog
            open={true}
            maxWidth={'lg'}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            ref={refDialog}
            disableEnforceFocus
          >
              <DialogTitle
                style={{ cursor: 'move' }}
                id="draggable-dialog-title"
              >
                Compartiendo Pantalla Tk {dataMessage.ticket}{' '}
                {dataMessage.project}
              </DialogTitle>

              <DialogContent>
                <video
                  id={'idCardMedia'}
                  //component="video"
                  ref={refElement}
                  controls
                  autoPlay
                  playsInline
                  width={'100% !important'}
                  style={{maxHeight: '80vh'}}
                />
              </DialogContent>
            <DialogActions sx={{height: '48px'}}>
              <Tooltip title="Finalizar compartir pantalla">
                <IconButton aria-label="Colgar" onClick={handleEndScreen}>
                  <CallEndIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Minimizar">
                <IconButton
                  aria-label="Minimizar"
                  onClick={() => {
                    setCloseFab(true);
                    refDialog.current.style.display = 'none';
                  }}
                >
                  <IndeterminateCheckBoxRoundedIcon />
                </IconButton>
              </Tooltip>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      )}
      {confirmOpen && (
        <ConfirmDialog
          title="Compartir pantalla?"
          open={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        >
          {`${dataMessage.userInfo.name} desea compartirle su pantalla, Tk ${dataMessage.ticket} ${dataMessage.project} ¿está de acuerdo?`}
        </ConfirmDialog>
      )}
      <ProgressCircular open={Progress} setOpen={setProgress} />
      {closeFab &&
        fabs.map((fab, index) => (
          <Zoom
            key={fab.color}
            in={0 === index}
            unmountOnExit
          >
            <Tooltip title="Reanudar">
              <Fab
                aria-label={fab.label}
                sx={{
                  position: 'absolute',
                  right: '2%',
                  top: '10px',
                  animation: `$flicker`,
                  animationDuration: '1s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  '@-moz-keyframes flicker': {
                    '0%': { opacity: 1.0 },
                    '50%': { opacity: 0.0 },
                    '100%': { opacity: 1.0 },
                  },
                  '@-webkit-keyframes flicker': {
                    '0%': { opacity: 1.0 },
                    '50%': { opacity: 0.0 },
                    '100%': { opacity: 1.0 },
                  },
                  '@keyframes flicker': {
                    '0%': { opacity: 1.0 },
                    '50%': { opacity: 0.0 },
                    '100%': { opacity: 1.0 },
                  },
                  color: 'common.white',
                  backgroundColor: green[500],
                  '&:hover': {
                  backgroundColor: green[600],
  }
                }}
                color={'secondary'}
                onClick={() => {
                  setOpenModal(true);
                  refDialog.current.style.display = 'block';
                }}
              >
                {fab.icon}
              </Fab>
            </Tooltip>
          </Zoom>
        ))}
    </div>
  );
};

export default SharedScreen;
