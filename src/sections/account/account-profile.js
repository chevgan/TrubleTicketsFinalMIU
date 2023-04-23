import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { storage } from '../../firebase';
import { firebaseApp } from '../../firebase';
const user = {
  avatar: '/assets/avatars/avatar-anika-visser.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Anika Visser',
  timezone: 'GTM-7'
};
import { useAuthContext } from './../../contexts/auth-context';
import { getAuth, updateProfile } from 'firebase/auth';
export const AccountProfile = () => {
  const storage = getStorage(firebaseApp);
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];

    // Создаем ссылку на файл в хранилище Firebase
    const storageRef = ref(storage, `users/${auth.user.uid}/avatar.jpg`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Обновляем профиль пользователя в Firebase
    const authInstance = getAuth();
    try {
      await updateProfile(authInstance.currentUser, {
        photoURL: downloadURL,
      });
      console.log('Фото пользователя обновлено.');
    } catch (error) {
      console.error('Ошибка обновления фото пользователя:', error);
    }
  };
  const auth = useAuth();
  const { user } = useAuthContext();
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 180,
              mb: 3,
              width: 180
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.name}
          </Typography>
          {/*<Typography
            color="text.secondary"
            variant="body2"
          >
            {user.city} {user.country}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>*/}
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          component="label"
          variant="text"
        >
          Обновить фото
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoUpload}
          />
        </Button>
      </CardActions>
    </Card>
  )
}
