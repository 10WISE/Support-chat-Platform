import * as React from 'react';
import { memo } from 'react';

import ConfirmDialog from 'utils/ConfirmDialog';
import StickyNotesDialogExternal from 'components/ControlChat/components/modal/StickyNotesDialogExternal';
import NewWindow from 'react-new-window';
import { BottomNavigationAction, BottomNavigation, Typography } from '@mui/material';

import NoteIcon from '@mui/icons-material/Note';
import BuildIcon from '@mui/icons-material/Build';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Swal from 'sweetalert2';
import https from 'mixins/https';
import { useSelector } from 'slices';

const iconLabel= {
  fontSize: {
    lg: '12px',
    md: '12px',
    sm: '10px'
  }

}as const;

const icon= {
  fontSize: {
    lg: 'x-large',
    md: 'x-large',
    sm: 'large'
  }
}as const;

interface ToolBarprops {
  setWindowsSticky: any;
  setOpenModalStickyNotesV3: any;
  openModalStickyNotesV3: any;
  windowsSticky: any;
  colorMode: any;
  setMode: any;
  mode: any;
}

declare const TOOLS_URL: any;

const ToolBar = (props: ToolBarprops) => {
  const {
    setWindowsSticky,
    setOpenModalStickyNotesV3,
    openModalStickyNotesV3,
    windowsSticky,
    colorMode,
    setMode,
    mode
  } = props;

  const { loggedUser } = useSelector((state) => state.app);

  const [textMessage, setTextMessage] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const inputOptions = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dark: 'Modo Oscuro',
        light: 'Modo Claro',
      });
    }, 1000);
  });

  const UpdateThemeUser = (idUser: string, theme: string) => {
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

  const changeTheme = async () => {
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
      UpdateThemeUser(loggedUser.userInfo.idUser, theme);
    }
  };

  return (
    <BottomNavigation 
    sx={{
      boxSizing: 'border-box',
      marginTop: '4px',
      marginRight: '5px',
      marginLeft: '-4px',
      flexGrow: 1,
      width: '15.5%',
      border: '2px solid',
      borderColor: '#529DFD',
      borderRadius: '3px !important',
    }}>
      <BottomNavigationAction
        showLabel={true}
        label={'Herramientas'}
        icon={<BuildIcon sx={icon}/>}
        onClick={() => {
          window.open(TOOLS_URL);
        }}
        sx={{padding : '0 !important'}}
      />
      <BottomNavigationAction
        showLabel={true}
        label={'Sticky Notes'}
        icon={<NoteIcon sx={icon}/>}
        onClick={() => {
          setWindowsSticky((prev: any) => [...prev, null]);
          setOpenModalStickyNotesV3(true);
        }}
        sx={{padding : '0 !important'}}
      />
      {windowsSticky.map((_, i) => (
        <NewWindow
          key={i}
          title="Sticky Notes"
          copyStyles={true}
          closeOnUnmount={true}
        >
          <StickyNotesDialogExternal
            open={openModalStickyNotesV3}
            setOpenModalStickyNotesV3={setOpenModalStickyNotesV3}
            callbackPage={(textSticky: string) => {
              setTimeout(
                async () =>
                  await window.navigator.clipboard.writeText(textSticky),
                3000
              );
            }}
          />
        </NewWindow>
      ))}
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
      <BottomNavigationAction
        showLabel={true}
        label={'Tema'}
        icon={<Brightness4Icon sx={icon}/>}
        onClick={changeTheme}
        sx={{padding : '0 !important'}}
      />
    </BottomNavigation>
  );
};

export default memo(ToolBar);
