import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, TextField, Box } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import formBD from '../../formBD.json';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../contexts/auth-context';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'next/router';

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Row = styled('div')({
  display: 'flex',
  gap: '10px',
});

const validationSchema = Yup.object().shape({
  siteName: Yup.object().shape({
    name: Yup.string().required('Выберите сайт'),
  }),
  employeeName: Yup.object().shape({
    name: Yup.string().required('Выберите дежурного'),
  }),
  responsiblePerson: Yup.object().shape({
    name: Yup.string().required('Выберите ответственного'),
  }),

});

const TicketsForm = () => {
  const siteNameOptions = formBD.siteName;
  const employeeNameOptions = formBD.employeeName;
  const responsiblePersonOptions = formBD.responsiblePerson;

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      siteName: null,
      employeeName: null,
      responsiblePerson: null,
      authUser: null,
      description: '',
      reason: '',
    },
    validationSchema,

    onSubmit: async (values) => {
      values.authUser = authUser.name;
      values.authEmail = authUser.email;
      values.dateReceived = dateReceived.format('YYYY-MM-DD HH:mm');
      values.dataLastSignalTime = dataLastSignalTime.format('YYYY-MM-DD HH:mm');

      // Отправка данных в Firebase
      await createTodo(values, values.switchValue, values.descriptionValue, values.diagnosticsValue, values.reasonValue);

      formik.resetForm();
      console.log(values); // Вывод данных в консоль

    },
  });
  const { user } = useAuthContext();
  const authUser = {...user}
  const clientName = formik.values.siteName ? formik.values.siteName.client : '';
  const address = formik.values.siteName ? formik.values.siteName.address : '';
  const [dateReceived, setDateReceived] = useState(moment());
  const [dataLastSignalTime, setDataLastSignalTime] = useState(moment());

  const createTodo = async (values) => {
    const ticketDocs = await getDocs(collection(db, "tickets"));
    const ticketCount = ticketDocs.docs.length;
    const ticketId = ticketCount + 1;
    await addDoc(collection(db, "tickets"), {
      ticketId: ticketId,
      siteName: values.siteName,
      employeeName: values.employeeName.name,
      responsiblePerson: values.responsiblePerson.name,
      authUser: values.authUser,
      authEmail: values.authEmail,
      dateReceived: values.dateReceived,
      dataLastSignalTime: values.dataLastSignalTime,
      dataChannelRecovery: " ",
      description: values.description,
      reason: values.reason,
      diagnostics: " ",
      ticketData: moment().locale('kz').format('DD.MM.YYYY HH:mm'),
      status: true,
    });
    console.log("Тикет создан!");
    router.push('/');
  };



  const TextInput = ({ label, value }) => {
    const inputRef = useRef(null);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.style.width = '0px';
        const newWidth = inputRef.current.scrollWidth + 10;
        inputRef.current.style.width = newWidth + 'px';
      }
    }, [value]);

    return (
      <TextField
        sx={{ minWidth: '100px' }}
        disabled
        label={label}
        value={value}
        inputRef={inputRef}
        InputProps={{
          readOnly: true,
        }}
      />
    );
  };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <FormContainer>
          <Box
            sx={{
            border: '1px solid',
            borderColor: formik.values.siteName ? 'green' : '#e8e8e8',
            borderRadius: '8px',
            p: '16px',
          }}
            >
          <Row>
            <Autocomplete
              sx={{ minWidth: '350px' }}
              disablePortal
              id="combo-box-demo"
              options={siteNameOptions}
              getOptionLabel={(option) => option.name}
              value={formik.values.siteName}
              onChange={(event, newValue) => {
                formik.setFieldValue('siteName', newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Станция"
                  error={formik.touched.siteName && Boolean(formik.errors.siteName)}
                  helperText={formik.touched.siteName && formik.errors.siteName}
                />
              )}
            />
          </Row>
            <br/>
            <Row>
              <TextInput label="Клиент" value={clientName} />
              <TextInput label="Адрес" value={address} />
            </Row>
          </Box>
          <Box
            sx={{
              border: '1px solid',
              borderColor: formik.values.employeeName && formik.values.responsiblePerson ? 'green' : '#e8e8e8',
              borderRadius: '8px',
              p: '16px',
            }}
          >
          <Row>
            <Autocomplete
              sx={{ minWidth: '350px' }}
              disablePortal
              id="combo-box-demo"
              options={employeeNameOptions}
              getOptionLabel={(option) => option.name}
              value={formik.values.employeeName}
              onChange={(event, newValue) => {
                formik.setFieldValue('employeeName', newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Дежурный"
                  error={formik.touched.employeeName && Boolean(formik.errors.employeeName)}
                  helperText={formik.touched.employeeName && formik.errors.employeeName}
                />
              )}
            />
            <Autocomplete
              sx={{ minWidth: '350px' }}
              disablePortal
              id="combo-box-demo"
              options={responsiblePersonOptions}
              getOptionLabel={(option) => option.name}
              value={formik.values.responsiblePerson}
              onChange={(event, newValue) => {
                formik.setFieldValue('responsiblePerson', newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  sx={{ width: '282px' }}
                  {...params}
                  label="Отвественный"
                  error={formik.touched.responsiblePerson && Boolean(formik.errors.responsiblePerson)}
                  helperText={formik.touched.responsiblePerson && formik.errors.responsiblePerson}
                />
              )}
            />
            <TextInput label="Создает" value={authUser.name} />
            </Row>
          </Box>
            <Box
              sx={{
                border: '1px solid',
                borderColor: '#e8e8e8',
                borderRadius: '8px',
                p: '16px',
              }}
            >
            <Row>
              <LocalizationProvider dateAdapter={AdapterMoment}>

                <DateTimePicker
                  label="Дата и время поступления заявки"
                  ampm={false}
                  inputFormat="YYYY-MM-DD HH:mm"
                  timeZone="Etc/GMT"
                  value={dateReceived}
                  onChange={(newValue) => setDateReceived(newValue)}
                  renderInput={(params) => <TextField {...params} sx={{ width: '350px' }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  label="Дата и время пропадания канала"
                  ampm={false}
                  inputFormat="YYYY-MM-DD HH:mm"
                  timeZone="Etc/GMT"
                  value={dataLastSignalTime}
                  onChange={(newValue) => setDataLastSignalTime(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Row>
          </Box>
          <Row>
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
          </Row>
          <Button type="submit" variant="contained">
            Создать тикет
          </Button>
        </FormContainer>
      </Form>
    </FormikProvider>
  );
};

export default TicketsForm;
