import { database, auth, db } from './firebase.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Your secret encryption key
const secretKey = "mySecretKey123";

// Encrypt latitude and longitude
function encryptLocation(lat, lng) {
  const encryptedLat = CryptoJS.AES.encrypt(lat.toString(), secretKey).toString();
  const encryptedLng = CryptoJS.AES.encrypt(lng.toString(), secretKey).toString();
  return { encryptedLat, encryptedLng };
}

// 🔹 Log action to Firestore
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

// Save current location
window.saveMyLocation = async function () {
  const status = document.getElementById('status');

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save a location.");
    return;
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  status.textContent = 'Getting your location…';

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const { encryptedLat, encryptedLng } = encryptLocation(lat, lng);

      const locationRef = ref(database, 'locations');
      const newLocationRef = push(locationRef);

      await set(newLocationRef, {
        latitude: encryptedLat,
        longitude: encryptedLng,
        uid: user.uid,
        timestamp: new Date().toISOString()
      });

      status.textContent = '📍 Location saved (encrypted) successfully!';

      // ✅ Log action
      await logAction("Saved encrypted location");
    },
    (error) => {
      console.error(error);
      status.textContent = '❌ Failed to get your location.';
    }
  );
};
