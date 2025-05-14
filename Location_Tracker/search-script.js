import { database, auth, db } from './firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔐 Your secret key for encryption/decryption
const secretKey = "mySecretKey123";

// 🔓 Decrypt encrypted coordinates
function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return parseFloat(bytes.toString(CryptoJS.enc.Utf8));
}

// 📏 Haversine formula for distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ✅ Log action to Firestore
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

// 📍 Use My Location
window.fillCurrentLocation = function () {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById('latitude').value = pos.coords.latitude;
      document.getElementById('longitude').value = pos.coords.longitude;
    },
    (err) => {
      alert("❌ Failed to get your location: " + err.message);
    }
  );
};

// 🔍 Encrypted location-based search
window.searchNearby = async function () {
  const userLat = parseFloat(document.getElementById('latitude').value);
  const userLng = parseFloat(document.getElementById('longitude').value);
  const radius = parseFloat(document.getElementById('radius').value);

  const locationList = document.getElementById('locationList');
  const result = document.getElementById('result');
  locationList.innerHTML = '';
  result.textContent = '🔎 Searching encrypted locations...';

  window.searchLayer.clearLayers();

  const searchCircle = L.circle([userLat, userLng], {
    color: 'blue',
    fillColor: '#cce6ff',
    fillOpacity: 0.4,
    radius: radius * 1000
  });
  window.searchLayer.addLayer(searchCircle);

  try {
    const snapshot = await get(ref(database, 'locations'));
    if (!snapshot.exists()) {
      result.textContent = '❌ No locations found.';
      return;
    }

    let count = 0;
    const data = snapshot.val();

    Object.values(data).forEach((loc) => {
      const lat = decrypt(loc.latitude);
      const lng = decrypt(loc.longitude);
      const distance = getDistance(userLat, userLng, lat, lng);

      if (distance <= radius) {
        count++;

        const li = document.createElement('li');
        li.textContent = `📍 Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}, Distance: ${distance.toFixed(2)} km`;
        locationList.appendChild(li);

        const marker = L.marker([lat, lng]).bindPopup(`📍 ${distance.toFixed(2)} km`);
        window.searchLayer.addLayer(marker);
      }
    });

    window.map.setView([userLat, userLng], 13);

    result.textContent = count > 0
      ? `✅ Found ${count} location(s) nearby.`
      : '❌ No nearby locations found.';

    // ✅ Log search action
    await logAction("Searched encrypted locations");

  } catch (error) {
    console.error(error);
    result.textContent = '❌ Error during encrypted search.';
  }
};
