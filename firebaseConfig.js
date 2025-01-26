// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC45ht0TwahH_mGg5vWZyFmLeBJ7cziNTE",
  authDomain: "smartbin-6f00a.firebaseapp.com",
  projectId: "smartbin-6f00a",
  storageBucket: "smartbin-6f00a.appspot.com",
  messagingSenderId: "462677735204",
  appId: "1:462677735204:web:1f69d0483a2aa3e254e5b1",
  measurementId: "G-D92TJCN5CN",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
