const admin = require('firebase-admin');

var firebaseConfig = {
  apiKey: "AIzaSyBZkzvBEFrYdg7PW2Fd7ymI65qROPz1Ny8",
  authDomain: "ind-si-infra-managment-184960.firebaseapp.com",
  databaseURL: "https://ind-si-infra-managment-184960.firebaseio.com",
  projectId: "ind-si-infra-managment-184960",
  storageBucket: "ind-si-infra-managment-184960.appspot.com",
  messagingSenderId: "149667563229",
  appId: "1:149667563229:web:c9d0b08e833a5ca1197d34"
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://ind-si-infra-managment-184960.firebaseio.com",
});


module.exports = admin; 

