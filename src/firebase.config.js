// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  //Config data here
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
