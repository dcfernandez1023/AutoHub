var firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyC8ETVsZqmpP9U5U09V7y49RWs8vj6qmnQ",
  authDomain: "auto-hub-car-management.firebaseapp.com",
  databaseURL: "https://auto-hub-car-management.firebaseio.com",
  projectId: "auto-hub-car-management",
  storageBucket: "auto-hub-car-management.appspot.com",
  messagingSenderId: "822128069595",
  appId: "1:822128069595:web:15c58ec17b511d7f6ab5fe",
  measurementId: "G-ZL33X1T0TF"
};

export var app = firebase.default.initializeApp(firebaseConfig);
