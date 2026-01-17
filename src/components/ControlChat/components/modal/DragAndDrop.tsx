import * as React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StickyNotes } from 'utils/HADSObjectsLocal';
import NoteIcon from '@mui/icons-material/Note';


const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (
  isDragging: any,
  draggableStyle: any,
  colorSticky: any
) => ({
  ...draggableStyle,

  ...(isDragging && {
    background: colorSticky,
  }),

  ...(true && {
    background: colorSticky,
  }),
});


interface DragAndDropProps {
  items: StickyNotes[];
  setItems: any;
}

const DragAndDrop = (props: DragAndDropProps) => {
  const { items, setItems } = props;

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const itemss = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(itemss);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <List sx={{maxHeight: '40vh',overflow: 'auto',paddingLeft: '10px',}} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable
                  key={item.idSticky}
                  draggableId={item.idSticky}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      sx={{
                        boxShadow: '10px 1px #A3A8FA',
                        padding: '10px',
                        borderLeft: '5px solid',
                        borderLeftColor: '#576197',
                        borderTop: '2px',
                      }}
                      ContainerComponent="li"
                      ContainerProps={{ ref: provided.innerRef }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        item.colorSticky
                      )}
                    >
                      <ListItemIcon>
                        <NoteIcon sx={{float: 'left'}}> </NoteIcon>
                        <b>{index}</b>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.idSticky}

                        // secondary={item.secondary}
                      />
                      <ListItemSecondaryAction>
                        {<b>{item.titleSticky}</b>}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDrop;
