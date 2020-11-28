import 'firebase/storage';
import firebase from 'firebase/app';
const firebaseApp = require('./firebaseapp.js');

export function uploadFile(file, path, callback) {
  try {
    var fileType = file.type;
    var metadata = {contentType: fileType};
    var storageRef = firebase.storage(firebaseApp.app).ref().child(path);
    storageRef.put(file, metadata).then(function(snapshot) {
      storageRef.getDownloadURL().then(function(url) {
        callback(url);
      });
      //alert("File uploaded successfully");
    });
  }
  catch(error) {
    //TODO: handle this error more elegantly
    alert(error.toString());
  }
}

export function downloadFile(url, callback, elementId) {
  var storageRef = firebase.storage(firebaseApp.app).refFromURL(url);
  storageRef.getDownloadURL().then((url, elementId) => {
    callback(url);
  });
}
