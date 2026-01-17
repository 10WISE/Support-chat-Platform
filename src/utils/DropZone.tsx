import { CssBaselineProps, styled } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DropzoneArea, DropzoneAreaBaseClasses } from 'react-mui-dropzone';
import CSS from 'csstype';


import ConfirmDialog from 'utils/ConfirmDialog';

interface DropZonePros {
  handleChange: any;
  setDragOver?: any;
  filesLimit: number;
}

const DropZone = (props: DropZonePros) => {

  const { handleChange, setDragOver, filesLimit } = props;
  const [textMessage, setTextMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDropRejected = (event: any) => {
    if (event.length > 1 || event[0].size > 10000000) {
      setTextMessage(
        `Por favor adjunte un solo archivo a la vez <br> y tenga en cuenta que el tamaño máximo admitido es de 10 MB`
      );
    } else {
      setTextMessage(
        `Se rechazó el archivo ${event[0].name}. Tipo de archivo no admitido <br>  Los archivos permitidos son (imagenes y/o PDF)`
      );
    }
    setConfirmOpen(true);
  };

  return (
    <>
      <DropzoneArea
        maxFileSize={10000000}
        onDropRejected={handleDropRejected}
        acceptedFiles={[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel.sheet.macroEnabled.12',
          'application/vnd.ms-excel',
        ]}
        onChange={(event) => {
          handleChange(event);
        }}
        showFileNamesInPreview={true}
        showFileNames
        dropzoneText="Déje caer aquí los archivos "
        showAlerts={false}
        filesLimit={filesLimit}
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
    </>
  );
};
export default DropZone;
