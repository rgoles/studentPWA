// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyB_kn   daiK7r-Dlv-6Dsnz4PkXI-pXdSTjM",
  authDomain: "studentapp-e1e05.firebaseapp.com",
  projectId: "studentapp-e1e05",
  storageBucket: "studentapp-e1e05.firebasestorage.app",
  messagingSenderId: "196786990149",
  appId: "1:196786990149:web:8feec61351a4fa649e072c",
  measurementId: "G-XTV85S0EEG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
