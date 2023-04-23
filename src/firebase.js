import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAKt4y_ZZMtH-R3SgQQT_ex9hIwJBoX1qA",
  authDomain: "trubletickets-d8411.firebaseapp.com",
  projectId: "trubletickets-d8411",
  storageBucket: "trubletickets-d8411.appspot.com",
  messagingSenderId: "619931451490",
  appId: "1:619931451490:web:31b136b4a3c310f3cb113b"
};
const addUser = async (userId, name, email) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      id: userId,
      name: name,
      email: email,
      // Add any other fields as needed
    });
    console.log('User added with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding user: ', e);
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
export const db = getFirestore();
export { auth, app };
const storage = getStorage(app);