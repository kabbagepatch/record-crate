import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';

import firebaseApp from '../firebaseApp';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getCurrentUser = () => {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
}

export const signUp = async (email : string, password : string, name : string) => {
  const auth = getAuth(firebaseApp);
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: name });
  await axios.post(
    `${baseUrl}/users/`,
    { name },
    { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
  );
}

export const signIn = async (email : string, password : string) => {
  const auth = getAuth(firebaseApp);
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  const auth = getAuth(firebaseApp);
  await auth.signOut();
}

export const verifyEmail = async () => {
  const auth = getAuth(firebaseApp);
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
}

export const resetPassword = async (email: string) => {
  const auth = getAuth(firebaseApp);
  await sendPasswordResetEmail(auth, email);
}
