import { database } from './firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Make sure this is the same as the one used when saving locations
const secretKey = "mySecretKey123";

// Function to decrypt the encrypted latitude/longitude
function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return parseFloat(bytes.toString(CryptoJS.enc.Utf8));
}

// Calculate distance between two lat/lng points using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Expose fillCurrentLocation to window (already works with HTML button)
window.fillCurrentLocation = function () {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById('latitude').value = position.coords.latitude;
      document.getElementById('longitude').value = position.coords.longitude;
    },
    (error) => {
      alert("Failed to get location: " + error.message);
    }
  );
};

// Search nearby encrypted locations and show markers
window.searchNearby = async function () {
  const userLat = parseFloat(document.getElementById('latitude').value);
  const userLng = parseFloat(document.getElementById('longitude').value);
  const radius = parseFloat(document.getElementById('radius').value);

  const locationList = document.getElementById('locationList');
  const result = document.getElementById('result');

  locationList.innerHTML = '';
  result.textContent = '🔍 Searching nearby locations...';

  try {
    const snapshot = await get(ref(database, 'locations'));
    if (!snapshot.exists()) {
      result.textContent = '❌ No saved locations found.';
      return;
    }

    const data = snapshot.val();
    let count = 0;

    // Clear old markers and circles from the map if any
    if (window.searchLayer) {
      window.searchLayer.clearLayers();
    } else {
      window.searchLayer = L.layerGroup().addTo(map);
    }

    // Show search radius as a blue circle
    const searchCircle = L.circle([userLat, userLng], {
      color: 'blue',
      fillColor: '#cce6ff',
      fillOpacity: 0.4,
      radius: radius * 1000
    });
    window.searchLayer.addLayer(searchCircle);

    Object.values(data).forEach((loc) => {
      const lat = decrypt(loc.latitude);
      const lng = decrypt(loc.longitude);
      const distance = getDistance(userLat, userLng, lat, lng);

      if (distance <= radius) {
        count++;

        const li = document.createElement('li');
        li.textContent = `📍 Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}, Distance: ${distance.toFixed(2)} km`;
        locationList.appendChild(li);

        // Add marker to map
        const marker = L.marker([lat, lng]).bindPopup(`📍 Distance: ${distance.toFixed(2)} km`);
        window.searchLayer.addLayer(marker);
      }
    });

    map.setView([userLat, userLng], 13);

    result.textContent = count > 0
      ? `✅ Found ${count} nearby location(s).`
      : '❌ No nearby locations found.';
  } catch (error) {
    console.error(error);
    result.textContent = '❌ Error fetching locations.';
  }
};
