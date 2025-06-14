// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA02cxwab8XCDgzl9H9IG9r-h0tNUUrIKM",
  authDomain: "smartcafe-e0e44.firebaseapp.com",
  projectId: "smartcafe-e0e44",
  storageBucket: "smartcafe-e0e44.firebasestorage.app",
  messagingSenderId: "724641679031",
  appId: "1:724641679031:web:06f2ad489453b71a8cef32",
  measurementId: "G-JH48PNZQDK"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

// (Optional) Analytics — you can keep this if you want
const analytics = getAnalytics(app);

// ✅ Export Firestore for use in FeedbackForm.js
export { db };
