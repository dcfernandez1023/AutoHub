import 'firebase/storage';
import firebase from 'firebase/app';
const firebaseApp = require('./firebaseapp.js');
const ERRORLOG = require('./errorLog.js');

export function uploadFile(file, path, prevImageUrl, callback, callbackOnError) {
  try {
    var fileType = file.type;
    var metadata = {contentType: fileType};
    var storageRef = firebase.storage(firebaseApp.app).ref().child(path);
    storageRef.put(file, metadata).then(function(snapshot) {
      storageRef.getDownloadURL().then(function(url) {
        callback(url);
        if(prevImageUrl.trim().length !== 0) {
          deleteFile(prevImageUrl,
            function() {
              return;
            },
            function(error) {
              ERRORLOG.logError(error);
              alert(error);
            }
          );
        }
      }).catch((error) => {
        ERRORLOG.logError(error);
        alert(error);
      });
      //alert("File uploaded successfully");
    }).catch((error) => {
      ERRORLOG.logError(error);
      callbackOnError(error);
    });
  }
  catch(error) {
    ERRORLOG.logError(error);
    //TODO: handle this error more elegantly
    callbackOnError(error);
  }
}

export function deleteFile(url, callback, callbackOnError) {
  try {
    var storageRef = firebase.storage(firebaseApp.app).refFromURL(url);
    storageRef.delete().then(() => {
      callback();
    }).catch((error) => {
      ERRORLOG.logError(error);
      callbackOnError(error);
    });
  }
  catch(error) {
    ERRORLOG.logError(error);
    alert(error);
  }
}

export function downloadFile(url, callback, elementId, callbackOnError) {
  try {
    var storageRef = firebase.storage(firebaseApp.app).refFromURL(url);
    storageRef.getDownloadURL().then((url, elementId) => {
      callback(url);
    }).catch((error) => {
      ERRORLOG.logError(error);
      callbackOnError(error);
    });
  }
  catch(error) {
    ERRORLOG.logError(error);
    alert(error);
  }
}
