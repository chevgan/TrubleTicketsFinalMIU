import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from './../../firebase';
import { Button, Chip, IconButton } from '@mui/material';
import OnDeleteTickets from './OnDeleteTickets';
import TicketsDescriptions from './TicketsDescriptions';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { handleEditClick } from './eventHandlers';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import ticketId from '../edit-ticket/[ticketId]';
const TicketsData = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketsHistory, setTicketsHistory] = useState([]);
  const [hasData, setHasData] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  // Columns tickets


  const Tele2Chip = styled(Chip)({
    backgroundColor: 'rgba(222,3,136,0.7)',
    color: 'white',
    width: 65,
  });
  const KcellChip = styled(Chip)({
    backgroundColor: 'rgba(101,45,134,0.78)',
    color: 'white',
    width: 65,
  });

  const StatusTrue = styled(Chip)({
    backgroundColor: 'rgb(102,169,73)',
    color: 'white',
  });
  const StatusFalse = styled(Chip)({
    backgroundColor: 'rgb(178,178,178)',
    color: 'white',
  });
  const columns = [
    {
      field: 'moreInfo',
      sortable: false,
      filterable: false,
      disableColumnMenu:true,
      headerName: ' ',
      width: 50,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            variant="contained"
          >
            <TicketsDescriptions id={params.id} data={tickets} ticketId={params.id} />
          </IconButton>
        </div>
      ),
    },,
    { field: 'ticketId', headerName: '#', width: 80 },
    { field: 'siteName', headerName: 'БС', width: 150 },
    {
      field: 'client',
      headerName: 'Клиент',
      width: 150,
      renderCell: (params) => {
        if (params.value === 'Tele 2') {
          return <Tele2Chip label="Tele 2" />
        } else if (params.value === 'K-cell') {
          return <KcellChip label="K-cell" />
        } else {
          return params.value;
        }
      },
    },
    { field: 'ticketData', headerName: 'Дата создания', width: 150 },
    { field: 'downTimeMini', headerName: 'Простой', width: 150 },
    { field: 'employeeName', headerName: 'Дежурный', width: 150 },
    { field: 'responsiblePerson', headerName: 'Ответсвенный', width: 150 },
    {
      field: 'status',
      headerName: 'Статус',
      width: 150,
      renderCell: (params) => {
        if (params.value === true) {
          return <StatusTrue label="Открыт" />
        } else if (params.value === false) {
          return <StatusFalse label="Закрыт" />
        } else {
          return params.value;
        }

      },
    },
    {
      field: 'col9',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="edit"
            variant="contained"
            color="primary"
            onClick={() => handleEditClick(params.id)}
          >
            <ModeEditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            variant="contained"
          >
            <OnDeleteTickets onDelete={() => deleteTodo(params.id)} />
          </IconButton>
        </div>
      ),
    },,

  ];
  const router = useRouter();

  const handleEditClick = (ticketId) => {
    router.push(`/edit-ticket/${ticketId}`);
  };
  // Data tickets
  const data = tickets.map((ticket, index) => ({
    id: ticket.id,
    ticketId: ticket.ticketId,
    siteName: ticket.siteName.name,
    client: ticket.siteName.client,
    ticketData: ticket.ticketData,
    downTime: ticket.downTime,
    employeeName: ticket.employeeName,
    responsiblePerson: ticket.responsiblePerson,
    downTimeMini: ticket.downTimeMini,
    status: ticket.status,
  }));
  // Data tickets
  const dataHistory = ticketsHistory.map((ticketHistory, index) => ({
    id: ticketHistory.id,
    ticketId: ticketHistory.ticketId,
    timestamp: ticketHistory.timestamp
  }));
  const updateTicket = async (ticketId, updatedData) => {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, updatedData);
    console.log("Информация о тикете обновлена!");
  };
  // Read tickets
  useEffect(() => {
    const q = query(collection(db, 'tickets'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let ticketsArr = [];
      querySnapshot.forEach((doc) => {
        ticketsArr.push({...doc.data(), id: doc.id});
      });
      setTickets(ticketsArr);
    });
    return () => unsubscribe();
  }, []);
  // Read tickets
  useEffect(() => {
    const q = query(collection(db, 'ticketHistory'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let ticketsArr = [];
      querySnapshot.forEach((doc) => {
        ticketsArr.push({...doc.data(), id: doc.id});
      });
      setTicketsHistory(ticketsArr);
    });
    return () => unsubscribe();
  }, []);
  // Delete Ticket
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "tickets", id));
    setTickets((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={hasData ? data : []}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default TicketsData;