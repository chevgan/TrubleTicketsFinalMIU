import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, TextField, Box } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import formBD from '../../formBD.json';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../contexts/auth-context';

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
});

const TicketsForm = ({ onSubmit }) => {
  const siteNameOptions = formBD.siteName;
  const employeeNameOptions = formBD.employeeName;
  const responsiblePersonOptions = formBD.responsiblePerson;

  const formik = useFormik({
    initialValues: {
      siteName: null,
      employeeName: null,
      responsiblePerson: null,
      authUser: null,
    },
    validationSchema,

    onSubmit: (values) => {
      values.authUser = authUser.name;
      values.authEmail = authUser.email;
      if (typeof onSubmit === 'function') {
        onSubmit(values);
      }
      formik.resetForm();
      console.log(values);
    },
  });
  const { user } = useAuthContext();
  const authUser = {...user}
  const clientName = formik.values.siteName ? formik.values.siteName.client : '';
  const address = formik.values.siteName ? formik.values.siteName.address : '';






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
            <TextInput label="Клиент" value={clientName} />
            <TextInput label="Адрес" value={address} />
          </Row>
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
                  {...params}
                  label="Отвественный"
                  error={formik.touched.responsiblePerson && Boolean(formik.errors.responsiblePerson)}
                  helperText={formik.touched.responsiblePerson && formik.errors.responsiblePerson}
                />
              )}
            />
            <TextInput label="Создает" value={authUser.name} />
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
