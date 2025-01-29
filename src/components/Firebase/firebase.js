/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUHIpLiiJ_VGarI-FkfZKhPOFbRSvnq-g",
  authDomain: "food-app-85f08.firebaseapp.com",
  projectId: "food-app-85f08",
  storageBucket: "food-app-85f08.firebasestorage.app",
  messagingSenderId: "261310615929",
  appId: "1:261310615929:web:9c8be0e715c37dbed59fa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db = getFirestore(app)
export default app;