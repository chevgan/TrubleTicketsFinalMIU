import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  TextField,
  Box,
  SvgIcon,
  Grid,
  Typography,
  Divider,
  Alert,
  Snackbar, Link
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../contexts/auth-context';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AlertTitle, Autocomplete, DatePicker } from '@mui/lab';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment/moment';
import formBD from '../../formBD.json';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { find } from 'lodash';
const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});


const validationSchema = Yup.object().shape({

});

const EditTicketForm = ({ ticket }) => {
  const [dataChannelRecovery, setDataChannelRecovery] = useState(null);
  const [selectedResponsiblePerson, setSelectedResponsiblePerson] = useState(ticket.responsiblePerson);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      description: ticket.description,
      diagnostics: ticket.diagnostics,
      reason: ticket.reason,
      dataChannelRecovery: ticket.dataChannelRecovery,
      responsiblePerson: ticket.responsiblePerson
    },
    validationSchema,

    onSubmit: async (values) => {
      formik.resetForm();
      console.log(values); // Вывод данных в консольe
    },
  });

  const addTicketHistory = async (ticketId, changes) => {
    const ticketHistoryRef = collection(db, "ticketHistory");
    const ticketHistory = {
      ticketId,
      changes,
      timestamp: moment().format('DD:MM:YYYY HH:mm'),
      authUser: user,
    };

    await addDoc(ticketHistoryRef, ticketHistory);
  };


  const closeTicket = async (date) => {
    const ticketRef = doc(db, "tickets", ticket.id);

    await updateDoc(ticketRef, {
      dataChannelRecovery: date.format('YYYY-MM-DD HH:mm'),
      downTime: downtimeString,
      downTimeMini: downtimeStringMini,
      status: false, // Устанавливаем статус тикета в false
    });
    const changes = {
      dataChannelRecovery: date.format('YYYY-MM-DD HH:mm'),
      downTime: downtimeString,
      downTimeMini: downtimeStringMini,
      status: false,
    };
    await addTicketHistory(ticket.id, changes);
    setShowAlert(true);
  };
  const updateDescr = async (values) => {
    const ticketRef = doc(db, "tickets", ticket.id);

    await updateDoc(ticketRef, {
      description: values.description,
      diagnostics: values.diagnostics,
      reason: values.reason,
    });
    const changes = {
      description: values.description,
      diagnostics: values.diagnostics,
      reason: values.reason,
    };
    await addTicketHistory(ticket.id, changes);
    setShowAlert(true);
  };

  const updateResponsiblePerson = async (values) => {
    const ticketRef = doc(db, "tickets", ticket.id);

    await updateDoc(ticketRef, {
      responsiblePerson: values.responsiblePerson.name,
    });
    const changes = {
      responsiblePerson: values.responsiblePerson.name,
    };
    await addTicketHistory(ticket.id, changes);
    setShowAlert(true);
  };


  // Вычисляем продолжительность простоя
  const lastSignalTime = moment(ticket.dataLastSignalTime);
  const channelRecoveryTime = moment(ticket.dataChannelRecovery);
  const downtimeDuration = moment.duration(channelRecoveryTime.diff(lastSignalTime));
  const hours = downtimeDuration.hours();
  const minutes = downtimeDuration.minutes();
  const responsiblePersonOptions = formBD.responsiblePerson;

  // Форматируем продолжительность простоя в строку
  const days = Math.floor(downtimeDuration.asMinutes() / 1440);
  let downtimeString = '';
  if (days > 0) {
    if (days === 1 || (days > 20 && days % 10 === 1)) {
      downtimeString += `${days} день `;
    } else if ((days >= 2 && days <= 4) || (days > 20 && days % 10 >= 2 && days % 10 <= 4)) {
      downtimeString += `${days} дня `;
    } else {
      downtimeString += `${days} дней `;
    }
  }

  if (hours > 0) {
    if (hours === 1 || (hours > 20 && hours % 10 === 1)) {
      downtimeString += `${hours} час `;
    } else if ((hours >= 2 && hours <= 4) || (hours > 20 && hours % 10 >= 2 && hours % 10 <= 4)) {
      downtimeString += `${hours} часа `;
    } else {
      downtimeString += `${hours} часов `;
    }
  }

  if (minutes > 0) {
    if (minutes === 1 || (minutes > 20 && minutes % 10 === 1)) {
      downtimeString += `${minutes} минута `;
    } else if ((minutes >= 2 && minutes <= 4) || (minutes > 20 && minutes % 10 >= 2 && minutes % 10 <= 4)) {
      downtimeString += `${minutes} минуты `;
    } else {
      downtimeString += `${minutes} минут `;
    }
  }


  const daysMini = Math.floor(downtimeDuration.asMinutes() / 1440);
  let downtimeStringMini = '';
  if (daysMini > 0) {
    downtimeStringMini += `${daysMini}д `;
  }

  const hoursMini = Math.floor((downtimeDuration.asMinutes() - daysMini * 1440) / 60);
  if (hoursMini > 0) {
    downtimeStringMini += `${hoursMini}ч `;
  }

  const minutesMini = downtimeDuration.asMinutes() - daysMini * 1440 - hoursMini * 60;
  downtimeStringMini += `${minutesMini}м `;


  useEffect(() => {
    const responsiblePerson = find(formBD.responsiblePerson, { name: ticket.responsiblePerson });
    setSelectedResponsiblePerson(responsiblePerson || null);
  }, [ticket.responsiblePerson]);
  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <FormContainer>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="body1">
                  Указав дату и нажав <strong>"Закрыть тикет"</strong>, вы сможете <strong>закрыть</strong> тикет.
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
                <br/>
                <br/>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    formik.setFieldValue('downTime', downtimeString);
                    formik.setFieldValue('downTimeMini', downtimeStringMini);
                    closeTicket(dataChannelRecovery);
                  }}
                >
                  Закрыть тикет
                </Button>
                <br/>
                <br/>
                <br/>
                <Typography variant="body1">
                  Чтобы изменить ответственного, <strong>выберите из списка ниже.</strong>
                </Typography>
                <br/>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  options={responsiblePersonOptions}
                  getOptionLabel={(option) => option.name}
                  value={selectedResponsiblePerson}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('responsiblePerson', newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '282px' }}
                      {...params}
                      label="Отвественный"
                    />
                  )}
                />
                <br/>
                <br/>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => updateResponsiblePerson(formik.values)} // вызываем функцию closeTicket при нажатии на кнопку
                >
                  Смена ответсвенного
                </Button>
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
                />
                <br/>
                <br/>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => updateDescr(formik.values)} // вызываем функцию closeTicket при нажатии на кнопку
                >
                  Обновить описание
                </Button>
              </Box>
              {
                showAlert && (
                  <Snackbar
                    open={showAlert}
                    autoHideDuration={3000}
                    onClose={() => {
                      setShowAlert(false);
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <Alert
                      severity="success"
                      onClose={() => setShowAlert(false)}
                      action={
                        <Link href="/" passHref>
                          <Button color="inherit" size="small">
                            Перейти на главную
                          </Button>
                        </Link>
                      }
                    >
                      Успешно обновлено!
                    </Alert>
                  </Snackbar>
                )
              }
            </Grid>
          </Grid>
        </FormContainer>
      </Form>
    </FormikProvider>
  );
};

export default EditTicketForm;
