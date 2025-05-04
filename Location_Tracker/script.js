import { database } from './firebase.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// 👉 1. Add CryptoJS for encryption (include in save-location.html):
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

const secretKey = "mySecretKey123"; // You can change this to anything secure

// 👉 2. Function to encrypt the latitude and longitude
function encryptLocation(lat, lng) {
  const encryptedLat = CryptoJS.AES.encrypt(lat.toString(), secretKey).toString();
  const encryptedLng = CryptoJS.AES.encrypt(lng.toString(), secretKey).toString();
  return { encryptedLat, encryptedLng };
}

// 👉 3. Main function to save location securely
window.saveMyLocation = async function () {
  const status = document.getElementById('status');

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  status.textContent = 'Getting location…';

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Encrypt the coordinates
      const { encryptedLat, encryptedLng } = encryptLocation(lat, lng);

      // Save to Firebase
      const locationRef = ref(database, 'locations');
      const newLocationRef = push(locationRef);

      await set(newLocationRef, {
        latitude: encryptedLat,
        longitude: encryptedLng,
        timestamp: new Date().toISOString()
      });

      status.textContent = 'Location successfully saved (encrypted)!';
    },
    (error) => {
      console.error(error);
      status.textContent = 'Unable to retrieve your location.';
    }
  );
};
