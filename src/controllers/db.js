const firebaseApp = require('./firebaseapp.js');
const DBFS = firebaseApp.app.firestore();

// writes one piece of data to the specified collection
export function writeOne(id, data, collectionName, callback, callbackOnError) {
	try {
		DBFS.collection(collectionName).doc(id).set(data)
			.then((res) => {callback(data)});
	}
	catch(error) {
		callbackOnError(error);
	}
}

	//writes many pieces of data to the specified collection; caller of this function is responsible for handling the resolve/reject of this async method
	export async function writeMany(idField, dataArr, collectionName) {
		for(var i = 0; i < dataArr.length; i++) {
			var data = dataArr[i];
			var id = data[idField];
			DBFS.collection(collectionName).doc(id).set(data)
				.then((res) => {return})
				.catch((error) => {return});
		}
	}

	export async function deleteMany(idField, dataArr, collectionName) {
		for(var i = 0; i < dataArr.length; i++) {
			var data = dataArr[i];
			var id = data[idField];
			var doc = DBFS.collection(collectionName).doc(id);
			doc.delete()
				.then((res) => {return})
				.catch((error) => {return});
		}
	}

export function deleteOne(id, collectionName, callback, callbackOnError) {
	try {
		var doc = DBFS.collection(collectionName).doc(id);
		doc.delete()
			.then(() => {callback(id)});
	}
	catch(error) {
		callbackOnError(error);
	}
}

// returns a Querey object that can be enabled to listen to changes in multiple documents within the specified collection
// only accepts ONE filter to querey
export function getQuerey(filterName, filterValue, collectionName) {
	return DBFS.collection(collectionName).where(filterName, "==", filterValue);
}
