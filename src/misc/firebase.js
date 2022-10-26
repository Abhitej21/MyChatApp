/* eslint-disable no-unused-vars */
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


const config = {
    apiKey: "AIzaSyBf8jd1ZWHCh_T8IquKKK-FyIzKNbn52w4",
    authDomain: "abhi-chat-app-7fc00.firebaseapp.com",
    projectId: "abhi-chat-app-7fc00",
    storageBucket: "abhi-chat-app-7fc00.appspot.com",
    messagingSenderId: "978789082901",
    appId: "1:978789082901:web:9577242db0bfd8fad22b1c"
  };

  const app = firebase.initializeApp(config);

export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();