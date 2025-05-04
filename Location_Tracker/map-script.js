import { database } from "./firebase.js";
import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// 1. Create the Leaflet map (default Nagpur)
const map = L.map("map").setView([21.1458, 79.0881], 6);

// 2. Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Get user's live location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;

    // Move map and mark user
    map.setView([userLatitude, userLongitude], 13);
    L.marker([userLatitude, userLongitude])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

    // Add a red circle (1 km range)
    L.circle([userLatitude, userLongitude], {
      radius: 1000,
      color: "red",
      fillOpacity: 0.1
    }).addTo(map);

    // 4. Fetch and show saved Firebase locations
    const locationsRef = ref(database, "locations/");
    onValue(locationsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const location = childSnapshot.val();
        L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(location.name || "Saved Location");
      });
    });

    // 6. Search nearby using Nominatim API
    document.getElementById("search-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const query = document.getElementById("search-input").value;

      const delta = 0.01; // ~1km box
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&bounded=1&viewbox=${userLongitude - delta},${userLatitude + delta},${userLongitude + delta},${userLatitude - delta}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            alert("No results found.");
            return;
          }

          data.forEach((place) => {
            L.marker([place.lat, place.lon])
              .addTo(map)
              .bindPopup(place.display_name)
              .openPopup();
          });
        })
        .catch((err) => {
          console.error("Search error:", err);
          alert("Something went wrong.");
        });
    });

  },
  (error) => {
    alert("Unable to get your location: " + error.message);
  }
);

// 5. Handle form submission to add a new location to Firebase
document.getElementById("location-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);

  // Push to Firebase
  push(ref(database, "locations"), {
    name: name,
    latitude: latitude,
    longitude: longitude
  });

  document.getElementById("location-form").reset();
});
