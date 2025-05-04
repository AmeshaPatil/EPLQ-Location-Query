// view-script.js
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const locationList = document.getElementById("locationList");
const locationsRef = ref(database, 'locations/');

onValue(locationsRef, (snapshot) => {
  locationList.innerHTML = ""; // Clear list
  snapshot.forEach((childSnapshot) => {
    const location = childSnapshot.val();
    const li = document.createElement("li");
    li.textContent = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
    locationList.appendChild(li);
  });
});
