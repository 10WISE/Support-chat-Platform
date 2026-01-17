import * as React from 'react';
import { StickyNotes as StickyNotesHADS } from 'utils/HADSObjectsLocal';
type StickyNotes = StickyNotesHADS & { isNew: string };
import * as _ from 'lodash';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './stylesSticky.css';

import {
  colors,
  TextareaAutosize,
  Card,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface NoteProps {
  note: StickyNotes;
  callbackPage: any;
  setFavorite: any;
  noteType: number;
  handleOpenModalEditSticky: any;
  handleOpenModalDeleteSticky: any;
  handleopenImage: any;
  setValue: any;
  value: any;
  hasProfile: any;
}
const Note = (props: NoteProps) => {
  const {
    note,
    callbackPage,
    noteType,
    handleOpenModalEditSticky,
    handleOpenModalDeleteSticky,
    handleopenImage,
    setFavorite,
    hasProfile,
  } = props;

  const pdf = 'data:application/pdf;';
  const file = note.filesSticky[0].file;
  const fileName = note.filesSticky[0].name;

  const covertToPdf = (file: any) => {
    var fixFile = file.slice(28, file.length);
    let pdfWindow = window.open('', `${fileName}`);
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(fixFile) +
        "'></iframe>"
    );
  };

  return (
    <Card 
    sx={{
      borderRadius: '10px',
      padding: '1rem',
      minHeight: '170px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: '5px',
    }} 
    style={{ background: note.colorSticky }}>
      <Typography className="note-title" component="div">
        <b>
          {note.idSticky + '.'} {note.titleSticky}
        </b>
        {hasProfile ? (
          <EditIcon
            sx={{float: 'right'}}
            cursor="pointer"
            onClick={handleOpenModalEditSticky}
          ></EditIcon>
        ) : (
          noteType === 2 && (
            <EditIcon
              sx={{float: 'right'}}
              cursor="pointer"
              onClick={handleOpenModalEditSticky}
            ></EditIcon>
          )
        )}
        {note.isNew?.length == 0 && (
          <Chip
            label="new"
            //color="primary"
            size="small"
            style={{
              float: 'right',
              backgroundColor: '#40D664',
              borderStyle: 'solid',
              borderColor: '#EBF3ED',
            }}
          />
        )}
      </Typography>
      <TextareaAutosize
        key={note.idSticky}
        style={{ background: note.colorSticky, border: 'none',resize: 'none' }}
        readOnly={true}
        value={note.bodySticky}
        maxRows={6}
      ></TextareaAutosize>
      {file !== '' && file.includes(pdf) ? (
        <>
          <Tooltip title={`${fileName}`}>
            <PictureAsPdfIcon
              name={note.filesSticky[0].name}
              onClick={() => {
                covertToPdf(file);
              }}
              cursor="pointer"
            ></PictureAsPdfIcon>
          </Tooltip>
        </>
      ) : (
        file !== '' && (
          <img
            onClick={() => {
              var name = note.filesSticky[0].name;
              handleopenImage(file, name);
            }}
            src={file}
            style={{ height: '30px', width: '30px' }}
          ></img>
        )
      )}
      <>
        <FileCopyIcon
          fontSize="small"
          className="copy-icon"
          onClick={() => {
            callbackPage(note.bodySticky);
            setFavorite(note);
          }}
        ></FileCopyIcon>
        {hasProfile ? (
          <DeleteIcon
            cursor="pointer"
            onClick={() => {
              handleOpenModalDeleteSticky(note);
            }}
          ></DeleteIcon>
        ) : (
          noteType === 2 && (
            <DeleteIcon
              cursor="pointer"
              onClick={() => {
                handleOpenModalDeleteSticky(note);
              }}
            ></DeleteIcon>
          )
        )}
      </>
    </Card>
  );
};

export default Note;
