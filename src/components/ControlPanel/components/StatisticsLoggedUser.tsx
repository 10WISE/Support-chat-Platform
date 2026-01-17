import * as React from 'react';
import {
  ListItem,
  ListItemAvatar,
  List,
  Button,
  ListItemText
} from '@mui/material';


interface StatisticsLoggedUserProps {
  count: number;
  tag: string;
}

export const StatisticsLoggedUser = (props: StatisticsLoggedUserProps) => {

  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Button
            variant="outlined"
          >
            {props.count}{' '}
          </Button>
        </ListItemAvatar>
        <ListItemText primary={props.tag} />
      </ListItem>
    </List>
  );
};
