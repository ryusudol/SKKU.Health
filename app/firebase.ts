import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration necessary for fetching firestore data
const firebaseConfig = {
  apiKey: "AIzaSyAiQyTUVRU-yQZv7Ur4c2CRVaQ5Kx4Y0Vc",
  authDomain: "final-project-21f9b.firebaseapp.com",
  projectId: "final-project-21f9b",
  storageBucket: "final-project-21f9b.appspot.com",
  messagingSenderId: "672384807475",
  appId: "1:672384807475:web:279d256e9278ad08eb2946",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
