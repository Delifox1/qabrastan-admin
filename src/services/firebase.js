import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7Jt0y7SRpQmVmyzTW3OfZsVQ1EFGoxKg",
  authDomain: "qabrastanapp.firebaseapp.com",
  projectId: "qabrastanapp",
  storageBucket: "qabrastanapp.firebasestorage.app",
  messagingSenderId: "665341408663",
  appId: "1:665341408663:web:7ccb5cdc196737cfb280d2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);