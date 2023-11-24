// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuZ9a1yoWGwKP7e2AHWAoACtaN0cpRXi0",
  authDomain: "hopechild-2eea3.firebaseapp.com",
  projectId: "hopechild-2eea3",
  storageBucket: "hopechild-2eea3.appspot.com",
  messagingSenderId: "820077533112",
  appId: "1:820077533112:web:f070b2ec1ad0f6a2d8e14d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db,auth, storage};