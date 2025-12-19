import { initializeApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import {
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: "AIzaSyAuZ4NSFd2X4gz_1l6xJ79pmMejRJud30o",
  authDomain: "pedulisampah-4a236.firebaseapp.com",
  projectId: "pedulisampah-4a236",
  storageBucket: "pedulisampah-4a236.firebasestorage.app",
  messagingSenderId: "933657996946",
  appId: "1:933657996946:web:914ab69adbcabea9c6404b",
}

const app = initializeApp(firebaseConfig)

const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

const db: Firestore = getFirestore(app)

export { auth, db }
export default db
