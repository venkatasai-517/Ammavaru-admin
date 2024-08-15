// firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDT-Z9n8WTESps32k8LjeaVJv5zvEkrDc",
  authDomain: "ammavaru-e4f04.firebaseapp.com",
  databaseURL: "https://ammavaru-e4f04-default-rtdb.firebaseio.com",
  projectId: "ammavaru-e4f04",
  storageBucket: "ammavaru-e4f04.appspot.com",
  messagingSenderId: "802558184435",
  appId: "1:802558184435:web:2db5b4fa225522ae0a2086",
  measurementId: "G-XWVVY0SRZQ",
};

var firebaseDB = firebase.initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseDB);
const storage = getStorage(firebaseDB);
const db1 = getFirestore(firebaseDB);
const storage1 = firebase.storage;
const db = firebase.firestore;

export { firestore, storage, db, db1, storage1 };
export default firebaseDB.database().ref();
