import * as React from 'react';
import { useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Tooltip } from '@mui/material';
import ConfirmDialog from 'utils/ConfirmDialog';

var extension = [
  '.pdf',
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'jpe',
  'png',
  'tiff',
  'tif',
  '.doc',
  '.docx',
  '.xlsx',
  '.xlsm',
  '.xlsb',
  '.xltx',
  '.txt',
];

interface UploadFileProps {
  onChangeFile: any;
  setDragOver: any;
}

const UploadFile = (props: UploadFileProps) => {
  const { onChangeFile, setDragOver } = props;
  const refInputFile = useRef<HTMLInputElement>(null);

  const [textMessage, setTextMessage] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const hasExtension = (value: string) => {
    return new RegExp(
      '(' + extension.join('|').replace(/\./g, '\\.') + ')$'
    ).test(value.toLowerCase());
  };

  return (
    <>
      <Tooltip title="Enviar Archivo">
        <IconButton
          //type="submit"
          sx={{ height: '10px', width: '10px',}}
          aria-label="send"
          onClick={() => {
            refInputFile.current.click();
          }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>
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
export default UploadFile;
