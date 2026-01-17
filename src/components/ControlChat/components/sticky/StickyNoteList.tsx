import * as React from 'react';
import * as _ from 'lodash';
import Note from './Note';
import './stylesSticky.css';
import { Grid } from '@mui/material';
import { StickyNotes as StickyNotesHADS } from 'utils/HADSObjectsLocal';
type StickyNotes = StickyNotesHADS & { isNew: string };

interface NotesListProps {
  notes?: StickyNotes[];
  callbackPage?: any;
  setFavorite?: any;
  noteType?: number;
  handleOpenModalEditSticky?: any;
  handleOpenModalDeleteSticky?: any;
  handleopenImage?: any;
  setValue?: any;
  value?: any;
  hasProfile?: any;
}
const StickyNoteList = (props: NotesListProps) => {
  const {
    notes,
    callbackPage,
    setFavorite,
    noteType,
    handleOpenModalEditSticky,
    handleOpenModalDeleteSticky,
    handleopenImage,
    setValue,
    value,
    hasProfile,
  } = props;

  return (
    <>
      <Grid sx={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gridAutoColumns: 'auto',
        overflowY: 'scroll',
        maxHeight: '400px',
        minHeight: '150px',
        scrollBehavior: 'smooth',
        marginTop: '10px',
      }}>
        {notes &&
          notes.map((note: StickyNotes) => (
            <Note
              note={note}
              key={note.idSticky}
              callbackPage={callbackPage}
              setFavorite={setFavorite}
              noteType={noteType}
              handleOpenModalEditSticky={() => {
                handleOpenModalEditSticky(note);
              }}
              handleOpenModalDeleteSticky={handleOpenModalDeleteSticky}
              handleopenImage={handleopenImage}
              setValue={setValue}
              value={value}
              hasProfile={hasProfile}
            ></Note>
          ))}
      </Grid>
    </>
  );
};

export default StickyNoteList;
