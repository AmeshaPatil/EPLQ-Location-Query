// Function to get user's current location (latitude and longitude)
function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude, "Longitude:", longitude);
  
          // You can use this latitude and longitude for your location-based queries
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  