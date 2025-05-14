// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔧 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVCzMJjoy6JHMEqPbeTwqyAZ0z3U4Kq-Y",
  authDomain: "eplq-locationquery.firebaseapp.com",
  projectId: "eplq-locationquery",
  storageBucket: "eplq-locationquery.appspot.com",
  messagingSenderId: "651622290281",
  appId: "1:651622290281:web:b4efc7e8f55a0eabd7e3f8",
  databaseURL: "https://eplq-locationquery-default-rtdb.firebaseio.com/"
};

// 🔌 Initialize services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export all needed services
export { app, database, auth, db };
