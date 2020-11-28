import 'firebase/storage';
import firebase from 'firebase/app';
const firebaseApp = require('./firebaseapp.js');

export function uploadFile(file, path) {
  try {
    var fileType = file.type;
    console.log(fileType);
    var metadata = {
      contentType: fileType
    }
    var storageRef = firebase.storage(firebaseApp.app).ref().child(path);
    storageRef.put(file, metadata).then(function(snapshot) {
      alert("File uploaded successfully");
    });
  }
  catch(error) {
    //TODO: handle this error more elegantly
    alert(error.toString());
  }
}
