import * as React from 'react';

import connHub from 'connHub';
import clsx from 'clsx';
import ConfirmDialog from 'utils/ConfirmDialog';
import { useSelector } from 'slices';
import ProgressCircular from 'utils/ProgressCircular';

import { useState } from 'react';
import {
  makeStyles,
  createStyles,
  useTheme,
  WithStyles
} from '@mui/styles';

import {Theme} from '@mui/material'

import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import { MessageShareScreen } from 'utils/HADSObjectsLocal';
import CallIcon from '@mui/icons-material/Call';
import { green } from '@mui/material/colors';
import Draggable from 'react-draggable';
import CallEndIcon from '@mui/icons-material/CallEnd';

import {
  Dialog,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Zoom,
  DialogTitle,
} from '@mui/material';

import { setShareOnline } from 'slices/app';
import { useDispatch } from 'react-redux';

let localconnion: RTCPeerconnion;
let idCallee: string;
let onCall: boolean;
let displayRemoteStream = (remoteStream: MediaStream) => {};

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    classVideo: {
      width: '100% !important',
      maxHeight: '80vh',
    },
    root: {
      maxHeight: '80vh',
      flexGrow: 1,
      minHeight: '80vh',
      transform: 'translateZ(0)',
      '@media all and (-ms-high-contrast: none)': {
        display: 'none',
      },
    },
    fab: {
      position: 'absolute',
      right: theme.spacing(0.5),
    },
    classFlicker: {
      animation: `$flicker`,
      animationDuration: '1s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
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
    fabGreen: {
      color: theme.palette.common.white,
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
    paper: {
      overflowY: 'unset',
    },
    customizedButton: {
      position: 'absolute',
      left: '95%',
      top: '-9%',
      backgroundColor: 'lightgray',
      color: 'gray',
    },
    prueba: { pointerEvents: 'none' },
  })
);

const PaperComponent = (props: any) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const WebRTC = () => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dataMessage, setDataMessage] = React.useState<MessageShareScreen>();
  const [sender, setSender] = React.useState('');
  const [open, setOpenModal] = useState(false);
  const [Progress, setProgress] = React.useState(false);
  const [closeFab, setCloseFab] = React.useState(false);

  const dispatch = useDispatch();

  const classes = useStyles();

  const refElement = React.useRef(null);
  const refDialog = React.useRef(null);

  const isconned = useSelector((state) => state.connHub.isconned);

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
      localconnion = new RTCPeerconnion(configuration);
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

    if (isconned) {
      connHub.on('HADS_ShareScreen', cbHADS_ShareScreen);
      connHub.on('HADS_EndShared', cbHADS_EndShared);
    }
    return () => {
      connHub.off('HADS_ShareScreen', cbHADS_ShareScreen);
      connHub.off('HADS_EndShared', cbHADS_EndShared);
    };
  }, [isconned]);

  React.useEffect(() => {
    const cbOnCandidate = (candidate: any) => {
      localconnion.addIceCandidate(new RTCIceCandidate(candidate));
    };
    connHub.on('onCandidate', cbOnCandidate);
    return () => {
      connHub.off('onCandidate', cbOnCandidate);
    };
  }, []);

  React.useEffect(() => {
    const cb = (offer: any, sender: any) => {
      setSender(sender);
      idCallee = sender;

      onCall = true;

      localconnion.setRemoteDescription(new RTCSessionDescription(offer));

      localconnion
        .createAnswer()
        .then((answer) => {
          return localconnion.setLocalDescription(answer);
        })
        .then(() => {
          connHub.invoke(
            'sendAnswer',
            sender,
            localconnion.localDescription
          ).fail((err) => {
            console.error(err);
          });
        })
        .catch((err) => {
          console.error(err, 'sendAnswer');
        });
    };
    connHub.on('onOffer', cb);

    return () => {
      connHub.off('onOffer', cb);
    };
  }, []);

  React.useEffect(() => {
    if (localconnion) {
      localconnion.onicecandidateerror = (event) => {};
      // Acá esta la respuesta magica de WebRTC
      localconnion.ontrack = (event) => {
        setProgress(false);
        setCloseFab(true);
        setOpenModal(true);
        dispatch(setShareOnline(dataMessage.idConversation));
        refElement.current.srcObject = event.streams[0];
      };

      localconnion.onicecandidate = (evt) => {
        if (evt.candidate) {
          connHub.invoke('sendCandidate', sender, evt.candidate).fail(
            (err) => {
              console.error(err, 'sendCandidate');
            }
          );
        }
      };

      localconnion.oniceconnionstatechange = (event: any) => {
        if (event.currentTarget.iceconnionState == 'disconned') {
          dispatch(setShareOnline(null));
          setOpenModal(false);
          setCloseFab(false);
        }
      };
    }
  }, [isconned, sender, localconnion]);

  const handleConfirm = async () => {
    setProgress(true);
    var obj = {
      type: 'response',
      value: true,
      m: dataMessage.idConversation,
    };
    connHub.invoke('SendMessage', sender, obj)
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

    connHub.invoke('SendMessage', sender, obj)
      .done((res) => {})
      .catch((err) => {
        console.error('se estalló', err);
      });
  };

  const handleEndScreen = () => {
    setProgress(true);
    connHub.invoke('hangup', dataMessage.idConversation, 'int')
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

  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: 'inherit' as 'inherit',
      classFans: clsx(classes.fab, classes.fabGreen, classes.classFlicker),
      icon: <CallIcon />,
      label: 'Renaudar',
    },
  ];

  const startRecording = async () => {
    const mediaDevices = navigator.mediaDevices as any;
    const stream = await mediaDevices.getDisplayMedia();
    refElement.current.srcObject = stream;
  };

  return (
    <div>
      <Dialog
        ref={refDialog}
        maxWidth={'lg'}
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Compartiendo Pantalla Tk {dataMessage.ticket} {dataMessage.project}
        </DialogTitle>
        <DialogContent>
          <video
            autoPlay
            ref={refElement}
            className={classes.classVideo}
          ></video>
        </DialogContent>
        <DialogActions>
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
            timeout={transitionDuration}
            style={{
              transitionDelay: `${0 === index ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Tooltip title="Reanudar">
              <Fab
                aria-label={fab.label}
                className={fab.classFans}
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

export default WebRTC;
