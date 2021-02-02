import firebase_admin
from firebase_admin import credentials, firestore

class Firebaseapp:
    def __init__(self):
        self.__initialize()

    def __initialize(self):
        cred = credentials.Certificate('./auto-hub-car-management-firebase-adminsdk-5byqx-bc59fbe1d9.json')
        self.__app = firebase_admin.initialize_app(cred)
        self.__db_client = firebase_admin.firestore.client(app=self.__app)

    def get_documents(self, collection_name, filter_name, filter_expression, filter_value):
        collection_ref = self.__db_client.collection(collection_name).where(filter_name, filter_expression, filter_value).get()
        data = []
        for doc in collection_ref:
            data.append(doc.to_dict())
        return data

    def write_documents(self, collection_name, id_key, documents):
        collection_ref = self.__db_client.collection(collection_name)
        for doc in documents:
            collection_ref.document(doc[id_key]).set(doc)
