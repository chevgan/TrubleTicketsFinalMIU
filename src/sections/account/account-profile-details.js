import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { getAuth, updateProfile } from 'firebase/auth';
import { auth } from './../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs } from "firebase/firestore";
const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

const updateUserDetails = async (displayName, photoURL) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    });
    console.log('User details updated successfully');
  } catch (err) {
    console.error(err);
    throw new Error('Error updating user details');
  }
};

export const AccountProfileDetails = () => {
  const [values, setValues] = useState({
    firstName: 'Anika',
    lastName: 'Visser',
    email: 'demo@devias.io',
    phone: '',
    state: 'los-angeles',
    country: 'USA'
  });
  const auth = useAuth();
  const userEmail = auth.user.email;
  const userName = auth.user.displayName;
  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        const [firstName, lastName] = user.displayName ? user.displayName.split(' ') : ['Не', 'указано'];
        setValues((prevState) => ({
          ...prevState,
          firstName,
          lastName
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // Обновляем профиль пользователя в Firebase
      const authInstance = getAuth();
      try {
        await updateProfile(authInstance.currentUser, {
          displayName: `${values.firstName} ${values.lastName}`,
        });
        console.log('Имя пользователя обновлено.');
      } catch (error) {
        console.error('Ошибка обновления имени пользователя:', error);
      }
    },
    [values]
  );






  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="Информация может быть отредактирована"
          title="Профиль"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  sx={{ width: '400px' }}
                  helperText="Пожалуйста, укажите имя"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid
                xs={12}
                md={7}
              >
                <TextField
                  sx={{ width: '400px' }}
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Сохранить
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
