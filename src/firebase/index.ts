import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBq_9c1otp2tt_sU6wOZFL64yY96XUXI8s",
  authDomain: "token-tracker-1cc4f.firebaseapp.com",
  projectId: "token-tracker-1cc4f",
  storageBucket: "token-tracker-1cc4f.appspot.com",
  messagingSenderId: "608271080615",
  appId: "1:608271080615:web:cfccc9cf3aca7b67f34f82",
  measurementId: "G-4VSQ7XS3L9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export { auth, db };
// The client ID and secret can always be accessed from Credentials in APIs & Services