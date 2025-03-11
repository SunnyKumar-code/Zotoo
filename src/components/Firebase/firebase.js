/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUHIpLiiJ_VGarI-FkfZKhPOFbRSvnq-g",
  authDomain: "food-app-85f08.firebaseapp.com",
  projectId: "food-app-85f08",
  storageBucket: "food-app-85f08.appspot.com",
  messagingSenderId: "261310615929",
  appId: "1:261310615929:web:9c8be0e715c37dbed59fa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Enable offline persistence for Firestore (helps with permission issues)
try {
  const settings = {
    cacheSizeBytes: 50000000, // 50 MB cache size
    experimentalForceLongPolling: true, // This may help with some firewall issues
    experimentalAutoDetectLongPolling: true,
  };

  // Apply settings to Firestore
  db.settings(settings);

  console.log("Firebase initialized with persistence enabled");
} catch (error) {
  console.error("Error configuring Firebase persistence:", error);
}

export default app;