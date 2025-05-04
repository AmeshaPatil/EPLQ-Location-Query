import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVCzMJjoy6JHMEqPbeTwqyAZ0z3U4Kq-Y",
  authDomain: "eplq-locationquery.firebaseapp.com",
  projectId: "eplq-locationquery",
  storageBucket: "eplq-locationquery.appspot.com",
  messagingSenderId: "651622290281",
  appId: "1:651622290281:web:b4efc7e8f55a0eabd7e3f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Export app and auth
export { app, auth };
