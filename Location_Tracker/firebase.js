// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// 🔧 Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVCzMJjoy6JHMEqPbeTwqyAZ0z3U4Kq-Y",
  authDomain: "eplq-locationquery.firebaseapp.com",
  projectId: "eplq-locationquery",
  storageBucket: "eplq-locationquery.appspot.com",
  messagingSenderId: "651622290281",
  appId: "1:651622290281:web:b4efc7e8f55a0eabd7e3f8",
  databaseURL: "https://eplq-locationquery-default-rtdb.firebaseio.com/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
const database = getDatabase(app);

export { database };
