import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';

import firebaseApp from '../firebaseApp';
import service, { CACHE_KEYS } from './service';

export const getCurrentUser = () => {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
}

export const getMe = async () => {
  const response = await service.get(`/users/me`,
  // @ts-ignore
  { id: CACHE_KEYS.ME });
  return response.data;
}

export const signUp = async (email : string, password : string, name : string) => {
  const auth = getAuth(firebaseApp);
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await service.post(`/users/`, { name }, {
    headers: { Authorization: `Bearer ${await userCred.user?.getIdToken()}` }
  });
}

export const guestSignUp = async (email : string, password : string, name : string) => {
  const auth = getAuth(firebaseApp);
  const credential = EmailAuthProvider.credential(email, password);
  const user = auth.currentUser;
  if (!user || !user.isAnonymous) {
    throw new Error("No guest account is active");
  }
  await linkWithCredential(user, credential);
  
  await service.put(`/users/me`, { name }, { headers: { Authorization: `Bearer ${await user.getIdToken(true)}` } },
    // @ts-ignore
    { cache: { update: { [CACHE_KEYS.ME]: 'delete' } } }
  );
}

export const signIn = async (email : string, password : string) => {
  const auth = getAuth(firebaseApp);
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  const auth = getAuth(firebaseApp);
  await auth.signOut();
    // @ts-ignore
  await service.storage.clear?.();
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

export const guestLogin = async () => {
  const auth = getAuth(firebaseApp);
  const userCred = await signInAnonymously(auth);
  await service.post(`/users/`, {}, {
    headers: { Authorization: `Bearer ${await userCred.user?.getIdToken()}` }
  });
}
