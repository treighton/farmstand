import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getAuth,
  connectAuthEmulator
} from 'firebase/auth';
import { getDatabase,  connectDatabaseEmulator } from "firebase/database";


const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

// Initialize Firebase
let app;
let db;
let auth
let rt;



app =
getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

db = getFirestore(app); // new
auth = getAuth(app)
rt = getDatabase(app)


export { app, db, auth, rt };


