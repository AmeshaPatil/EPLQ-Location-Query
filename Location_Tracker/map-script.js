import { database, auth, db } from "./firebase.js";
import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔐 AES Decrypt
const secretKey = "mySecretKey123";
function decrypt(text) {
  const bytes = CryptoJS.AES.decrypt(text, secretKey);
  return parseFloat(bytes.toString(CryptoJS.enc.Utf8));
}

// ✅ Log actions to Firestore
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

// 1. Initialize map
const map = L.map("map").setView([21.1458, 79.0881], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Get user's current location
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    map.setView([userLat, userLng], 13);
    L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

    L.circle([userLat, userLng], {
      radius: 1000,
      color: "red",
      fillOpacity: 0.1
    }).addTo(map);

    // 3. Show encrypted locations from Firebase
    const locationsRef = ref(database, "locations/");
    onValue(locationsRef, async (snapshot) => {
      snapshot.forEach((child) => {
        const location = child.val();
        try {
          const lat = decrypt(location.latitude);
          const lng = decrypt(location.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(location.name || "Saved Location");
          }
        } catch (e) {
          console.warn("Decryption failed:", e.message);
        }
      });

      await logAction("Viewed map and saved locations");
    });

    // 4. Handle Nominatim search
    document.getElementById("search-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const query = document.getElementById("search-input").value;

      const delta = 0.01;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&bounded=1&viewbox=${userLng - delta},${userLat + delta},${userLng + delta},${userLat - delta}`;

      fetch(url)
        .then(res => res.json())
        .then(async (data) => {
          if (!data.length) {
            alert("No results found.");
            return;
          }

          data.forEach(place => {
            L.marker([place.lat, place.lon])
              .addTo(map)
              .bindPopup(place.display_name)
              .openPopup();
          });

          await logAction("Searched nearby using Nominatim");
        })
        .catch(err => {
          console.error("Search error:", err);
          alert("Something went wrong.");
        });
    });
  },
  (err) => {
    alert("Geolocation error: " + err.message);
  }
);

// 5. Manual add location form
document.getElementById("location-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const lat = parseFloat(document.getElementById("latitude").value);
  const lng = parseFloat(document.getElementById("longitude").value);

  if (isNaN(lat) || isNaN(lng)) {
    alert("Enter valid coordinates.");
    return;
  }

  const encryptedLat = CryptoJS.AES.encrypt(lat.toString(), secretKey).toString();
  const encryptedLng = CryptoJS.AES.encrypt(lng.toString(), secretKey).toString();

  await push(ref(database, "locations"), {
    name,
    latitude: encryptedLat,
    longitude: encryptedLng
  });

  await logAction("Added a location manually");

  document.getElementById("location-form").reset();
});
