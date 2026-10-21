import { ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDm-EuZ9h1TwfppDLnksrj7Ue-WULUd-Q",
  authDomain: "tracker-services-508200.firebaseapp.com",
  projectId: "tracker-services-508200",
  storageBucket: "tracker-services-508200.firebasestorage.app",
  messagingSenderId: "425540880944",
  appId: "1:425540880944:web:105860928390b790c93bf5",
  measurementId: "G-E59M8W8GVK"
};

const firebaseApp = initializeApp(firebaseConfig);

export const currentUser = ref<User | null>(null);
export const userLoaded = ref(false)
onAuthStateChanged(getAuth(), user => {
  currentUser.value = user;
  userLoaded.value = true;
});

export default firebaseApp;
