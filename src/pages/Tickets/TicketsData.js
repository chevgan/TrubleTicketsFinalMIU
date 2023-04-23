import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from './../../firebase';
import { Button, IconButton } from '@mui/material';
import { handleEditClick, handleDeleteClick } from './eventHandlers';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import OnDeleteTickets from './OnDeleteTickets';
import TicketsDescriptions from './TicketsDescriptions';
const TicketsData = () => {
  const [tickets, setTickets] = useState([]);
  const [hasData, setHasData] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  // Columns tickets
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
            <TicketsDescriptions id={params.id} data={tickets} />
            </IconButton>
        </div>
      ),
    },,
    { field: 'ticketId', headerName: '#', width: 80 },
    { field: 'siteName', headerName: 'БС', width: 150 },
    { field: 'client', headerName: 'Клиент', width: 150 },
    { field: 'ticketData', headerName: 'Дата создания', width: 150 },
    { field: 'downTime', headerName: 'Простой', width: 150 },
    { field: 'employeeName', headerName: 'Дежурный', width: 150 },
    { field: 'responsiblePerson', headerName: 'Ответсвенный', width: 150 },
    { field: 'status', headerName: 'Статус', width: 150 },
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

  // Data tickets
  const data = tickets.map((ticket, index) => ({
    id: ticket.id,
    ticketId: ticket.ticketId,
    siteName: ticket.siteName,
    client: ticket.client,
    ticketData: ticket.ticketData,
    downTime: ticket.downTime,
    employeeName: ticket.employeeName,
    responsiblePerson: ticket.responsiblePerson,
    status: ticket.status,
  }));

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