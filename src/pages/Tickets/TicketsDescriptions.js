import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Chip } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TicketsDescriptions = ({ id, data }) => {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const selectedTicket = data.find((ticket) => ticket.id === id);
    setTicket(selectedTicket);
  }, [id, data]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (!ticket) {
    return null;
  }
  return (
    <div>
      <IconButton  onClick={handleClickOpen}>
        <AddIcon/>
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', background: "children" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <DialogTitle>{`Информация о ТТ: №${ticket.ticketId}`}</DialogTitle>
            </Typography>
            <Button autoFocus color="inherit" size="large" onClick={handleClose}>
              Закрыть
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}

export default TicketsDescriptions;