import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, TextField, Box, SvgIcon, Grid, Typography, Divider } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../contexts/auth-context';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment/moment';

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});


const validationSchema = Yup.object().shape({

});

const EditTicketForm = ({ ticket }) => {
  const [dataChannelRecovery, setDataChannelRecovery] = useState(null);
  const formik = useFormik({
    initialValues: {
      description: ticket.description,
      diagnostics: ticket.diagnostics,
      reason: ticket.reason,
      dataChannelRecovery: ticket.dataChannelRecovery,
    },
    validationSchema,

    onSubmit: async (values) => {
      await updateTicket(values);
      formik.resetForm();
      console.log(values); // Вывод данных в консоль
    },
  });

  const updateTicket = async (values) => {
    const ticketRef = doc(db, "tickets", ticket.id);

    await updateDoc(ticketRef, {
      description: values.description,
      diagnostics: values.diagnostics,
      reason: values.reason,
      dataChannelRecovery: values.dataChannelRecovery.format('YYYY-MM-DD HH:mm'),
    });
  };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <FormContainer>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="body1">
                  Указав дату и нажав <strong>"Обновить тикет"</strong>, вы сможете <strong>закрыть</strong> тикет.
                </Typography>
                <br/>
                <DateTimePicker
                  label="Дата и время восстановления канала"
                  ampm={false}
                  inputFormat="YYYY-MM-DD HH:mm"
                  timeZone="Etc/GMT"
                  value={dataChannelRecovery}
                  onChange={(newValue) => {
                    setDataChannelRecovery(newValue);
                    formik.setFieldValue('dataChannelRecovery', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={5}>
              <Box >
                <Typography variant="body1">
                  Обновление описания тикета <strong>происходит только при его наличии</strong>.
                </Typography>
                <br/>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Описание"
                  id="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Диагностика"
                  id="diagnostics"
                  value={formik.values.diagnostics}
                  onChange={formik.handleChange}
                  error={formik.touched.diagnostics && Boolean(formik.errors.diagnostics)}
                  helperText={formik.touched.diagnostics && formik.errors.diagnostics}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Причина"
                  id="reason"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
                />
              </Box>
            </Grid>
          </Grid>

        </FormContainer>
        <Button type="submit" variant="contained">
          Обновить тикет
        </Button>
        <Button
          component={NextLink}
          href="/"
          startIcon={(
            <SvgIcon fontSize="small">
              <ArrowLeftIcon />
            </SvgIcon>
          )}
          variant="contained"
        >
          Отменить редактирование
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default EditTicketForm;