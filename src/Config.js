import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


const firebaseConfig = {
    apiKey: "AIzaSyCkYtqq0j9d3Z3PQm7WfVS9NUn8bbmMbzA",
    authDomain: "e-commerse2-6a696.firebaseapp.com",
    projectId: "e-commerse2-6a696",
    storageBucket: "e-commerse2-6a696.appspot.com",
    messagingSenderId: "120094135533",
    appId: "1:120094135533:web:4f6448d99734a5c60128e4",
    measurementId: "G-GJQNMT9Z8G"
  };

  firebase.initializeApp(firebaseConfig);

  const auth=firebase.auth();
  const fs=firebase.firestore();
  const storage=firebase.storage();

  export{auth,fs,storage};
