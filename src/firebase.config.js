// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjFz_PvHWMJiJxywQAN1yx3_gHtTrlAOc",
  authDomain: "house-marketplace-app-5a52f.firebaseapp.com",
  projectId: "house-marketplace-app-5a52f",
  storageBucket: "house-marketplace-app-5a52f.appspot.com",
  messagingSenderId: "839807513962",
  appId: "1:839807513962:web:1fe34f7132de65e2a5a113",
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
