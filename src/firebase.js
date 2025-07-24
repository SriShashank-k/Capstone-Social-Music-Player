// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3hB20wDVzbSGhrz-67sfMTfpHmbBtXGo",
  authDomain: "my-music-player-chat.firebaseapp.com",
  projectId: "my-music-player-chat",
  storageBucket: "my-music-player-chat.appspot.com",
  messagingSenderId: "855707245004",
  appId: "1:855707245004:web:03f91c590fba1e93f0e569",
  measurementId: "G-KSZJBWYMXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
