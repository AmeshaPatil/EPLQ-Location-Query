// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVCzMJjoy6JHMEqPbeTwqyAZ0z3U4Kq-Y",
  authDomain: "eplq-locationquery.firebaseapp.com",
  databaseURL: "https://eplq-locationquery-default-rtdb.firebaseio.com/",
  projectId: "eplq-locationquery",
  storageBucket: "eplq-locationquery.appspot.com",
  messagingSenderId: "651622290281",
  appId: "1:651622290281:web:b4efc7e8f55a0eabd7e3f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { app, auth, db };
