import { auth, database, db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const locationList = document.getElementById("locationList");

// 🔹 Function to log user actions
async function logAction(actionName) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "logs"), {
    action: actionName,
    uid: user.uid,
    email: user.email,
    timestamp: serverTimestamp()
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // Get role from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const role = userData.role;

      const locationsRef = ref(database, 'locations/');
      onValue(locationsRef, async (snapshot) => {
        locationList.innerHTML = ""; // Clear list

        snapshot.forEach((childSnapshot) => {
          const location = childSnapshot.val();

          // If user is admin, show all
          // If user is normal, show only their locations
          if (role === "admin" || location.uid === uid) {
            const li = document.createElement("li");
            li.textContent = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
            locationList.appendChild(li);
          }
        });

        // ✅ Log view action after displaying
        await logAction("Viewed saved locations");
      });
    } else {
      alert("User document not found!");
    }
  } else {
    alert("No user logged in!");
    window.location.href = "../signup/login.html"; // redirect if not logged in
  }
});
