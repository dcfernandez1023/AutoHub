import firebase from 'firebase';
const firebaseApp = require('./firebaseapp.js');
const AUTH = firebaseApp.app.auth();

//google authentication method
export function googleSignin() {
	var provider = new firebase.auth.GoogleAuthProvider();
	AUTH.signInWithPopup(provider).then(function(result) {
	}).catch(function(error) {
		alert(error.message.toString());
	});
}

//signs the user out
export function signout(test) {
	AUTH.signOut().then(function(result) {
		window.location.pathname = "/";
	}).catch(function(error) {
		alert(error.message);
	});
}

//takes in a callback to capture value from the async callback method passed to onAuthStateChanged
export function isUserSignedin(callback) {
	AUTH.onAuthStateChanged(function(user) {
		try {
			callback(user);
		}
		catch(error) {
			alert(error.message);
		}
	});
}
