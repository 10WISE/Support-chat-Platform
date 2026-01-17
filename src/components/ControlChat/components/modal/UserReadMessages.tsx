import * as React from 'react';
import { MessageL } from 'utils/HADSObjectsLocal';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
} from '@mui/material';

import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

interface UserReadMessagesProps {
  onClose?: any;
  users: MessageL.UserRead[];
  setOpenUser: React.Dispatch<React.SetStateAction<boolean>>;
  openUser: boolean;
}

const UserReadMessages = (props: UserReadMessagesProps) => {
  const { onClose, users, setOpenUser, openUser } = props;

  const handleClose = () => {
    setOpenUser(false);
  };

  const handleListItemClick = () => {
    setOpenUser(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={openUser}
    >
      <DialogTitle id="simple-dialog-title">
        ¿Quién ha leído el mensaje?
      </DialogTitle>
      <List>
        {users.map((user: any) => (
          <ListItem
            button
            onClick={() => handleListItemClick()}
            key={user.userInfo.idUser}
          >
            <ListItemAvatar>
              <Avatar sx={{backgroundColor: blue[100], color: blue[600]}}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.userInfo.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default UserReadMessages;
