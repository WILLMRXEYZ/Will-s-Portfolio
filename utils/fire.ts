import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ============================================================================
//  🔥 FIREBASE CONFIGURATION
//  1. Go to https://console.firebase.google.com/
//  2. Create a New Project
//  3. Add a "Web App" to the project
//  4. Copy the config object below and replace the placeholders
// ============================================================================

const firebaseConfig = {
  // REPLACE THESE VALUES WITH YOUR REAL KEYS FROM FIREBASE CONSOLE
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc12345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Checks if Firebase is configured (dummy check)
 */
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}