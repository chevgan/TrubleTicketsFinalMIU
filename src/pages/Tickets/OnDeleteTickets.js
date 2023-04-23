import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, IconButton } from '@mui/material';
import { AlertTitle } from '@mui/lab';

const OnDeleteTickets = ({ id, onDelete }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <IconButton
          aria-label="delete"
          variant="contained"
          onClick={handleClickOpen}
        >
          <DeleteIcon/>
        </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Вы уверены, что хотите удалить?`}
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>Важно!</AlertTitle>
            Проверьте, что вы удаляете ТТ в последовательности <strong>по порядку</strong> в таблице.
            <br/>
            <br/>
            <strong>Если это не так, обратитесь к администратору.</strong>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={() => onDelete(id)} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OnDeleteTickets;