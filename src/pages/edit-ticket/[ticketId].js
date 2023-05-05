import { useRouter } from 'next/router';
import EditTicketForm from '../Tickets/EditTicketForm';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, Button, Divider, Grid, LinearProgress, SvgIcon } from '@mui/material';
import { margin } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const EditTicketPage = () => {
  const router = useRouter();
  const { ticketId } = router.query;
  const [ticket, setTicket] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);



  useEffect(() => {
    if (ticketId) {
      console.log(`Ticket ID: ${ticketId}`); // Check if ticketId is correct
      const ticketRef = doc(db, 'tickets', ticketId);
      const unsubscribe = onSnapshot(ticketRef, (snapshot) => {
        console.log(snapshot.data()); // Check if snapshot data is correct
        setTicket({ id: snapshot.id, ...snapshot.data() });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [ticketId]);;

  if (!ticket) {
    return <div>
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
          </div>;
  }

  return (
    <div>
      <Box sx={{ ml: 2, mr: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <h1>Редактировать тикет #{ticket.ticketId}</h1>
          </Grid>
          <Grid item>
            <Button
              href="/"
              startIcon={
                <SvgIcon>
                  <ArrowBackIosIcon />
                </SvgIcon>
              }
              variant="outlined"
            >
              Отменить редактирование
            </Button>
          </Grid>
        </Grid>
        <Divider variant="middle" sx={{ borderColor: '#4338CA', m: 0 }} />
        <br/>
        <EditTicketForm ticketId={ticketId} ticket={ticket} />
      </Box>
    </div>
  );
};

export default EditTicketPage;
