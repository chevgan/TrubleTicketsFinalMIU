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
import { Avatar, Box, Card, CardActions, CardContent, Chip, Grid, Tab } from '@mui/material';
import { useAuthContext } from '../../contexts/auth-context';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import OnDeleteTickets from './OnEditTickets';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TicketsDescriptions = ({ id, data }) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { user } = useAuthContext();

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
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab sx={{marginLeft: 3}} label="Дополнительная информация" value="1" />
                <Tab sx={{marginLeft: 3}} label="История изменений" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <List>
                <Grid container justifyContent="flex-end" >
                  {ticket.employeeName && (
                    <>
                      <Avatar
                        sx={{ height: 50, width: 50, marginRight: 2 }}
                        src={'/assets/avatars/default_avatar.png'}
                      />
                      <Typography color="text.secondary" variant="body2" sx={{ marginRight: 3 }}>
                        {ticket.employeeName}<br />
                        Заполнил
                      </Typography>
                    </>
                  )}
                  <>
                    <Avatar
                      sx={{ height: 50, width: 50, marginRight: 2 }}
                      src={user && user.avatar ? user.avatar : '/assets/avatars/default_avatar.png'}
                    />
                    <Typography color="text.secondary" variant="body2">
                      {user && user.name}<br/>
                      Создал тикет
                    </Typography>
                  </>
                </Grid>
                <ListItem >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: 210 }}>
                        <CardContent>
                          <Typography variant="h5" component="div" gutterBottom>
                            Станция:
                          </Typography>
                          <Typography variant="h6" component="div">
                            {ticket.siteName.name}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {ticket.siteName.address}
                          </Typography>
                          <Typography variant="body3">
                            <span style={{ fontWeight: 'bold' }}>Клиент: </span>{ticket.siteName.client}
                            <br />
                            <span style={{ fontWeight: 'bold' }}>Номер ТТ: </span>{ticket.ticketId}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: 210 }}>
                        <CardContent>
                          <Typography variant="h5" component="div" gutterBottom>
                            Дата и время:
                          </Typography>
                          <Typography>
                            <Divider/>
                            Дата создания: <span style={{ fontWeight: '600' }}>{ticket.ticketData}</span>
                            <Divider/>
                          </Typography>
                          <Typography  >
                            <Divider/>
                            Дата поступление звонка: <span style={{ fontWeight: '600' }}>{ticket.dateReceived}</span>
                            <Divider/>
                          </Typography>
                          <Typography>
                            <Divider/>
                            Дата пропадания канала: <span style={{ fontWeight: '600' }}>{ticket.dataLastSignalTime}</span>
                            <Divider/>
                          </Typography>
                          <Typography>
                            <Divider/>
                            <span style={{ color: "#6366F1" }}>Дата восстановления канала: </span><span style={{ fontWeight: '600' }}>123123</span>
                            <Divider/>
                          </Typography>
                          <Typography>
                            <Divider/>
                            <span style={{ color: "#6366F1" }}>Простой: </span><span style={{ fontWeight: '600' }}>123123</span>
                            <Divider/>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ minHeight: 210 }}>
                        <CardContent>
                          <Typography variant="h5" component="div" gutterBottom>
                            Описание:
                          </Typography>
                          <Typography variant="h7" component="div">
                            {ticket.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ minHeight: 210 }}>
                        <CardContent>
                          <Typography variant="h5" component="div" gutterBottom>
                            Диагностика:
                          </Typography>
                          <Typography variant="h7" component="div">
                            {ticket.diagnostic}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ minHeight: 210 }}>
                        <CardContent>
                          <Typography variant="h5" component="div" gutterBottom>
                            Причина:
                          </Typography>
                          <Typography variant="h7" component="div">
                            {ticket.reason}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </TabPanel>




            <TabPanel value="2">История изменений</TabPanel>
          </TabContext>
        </Box>
      </Dialog>
    </div>
  );
}

export default TicketsDescriptions;


