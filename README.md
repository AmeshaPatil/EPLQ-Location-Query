# EPLQ: Efficient Privacy-Preserving Location-Based Query on Encrypted Data

This project allows users to save, search, and view encrypted geographic locations securely using Firebase and AES encryption.

## 🔒 Features

- 📍 Save encrypted latitude and longitude
- 🔐 AES encryption with secret key
- 🔎 Search nearby encrypted locations by radius
- 🌍 View locations on an interactive Leaflet map
- 🧑‍💻 Role-based access: Admin & User
- 🔁 Logs all user actions to Firestore (save, search, view)
- 🔥 Firebase Auth + Realtime Database + Firestore
- ✅ Fully client-side secured logic

## 🗂 Folder Structure
  /signup/
├── index.html (Sign Up)
├── login.html (Login)
├── dashboard.html (logout)
├── admin-dashboard.html
├──user-dashboard.html

/location-tracker/
├── save-location.html
├── view-location.html
├── search-location.html
├── map-view.html
├── firebase.js
├── script.js
├── view-script.js
├── search-script.js
├── map-script.js


## 🚀 How to Run

1. Clone or download this repo
2. Open `signup/index.html` in your browser
3. Sign up or log in
4. Use the dashboard to save or search locations

> Note: You must be logged in to use location features

## 🛠 Technologies Used

- HTML, CSS, JavaScript
- Firebase Authentication
- Firebase Realtime Database
- Firebase Firestore
- CryptoJS (AES encryption)
- Leaflet.js (Interactive Map)
- Nominatim API (Nearby place search)

## 👤 Created by

**Amesh Patil**  
MCA - MIT College of Management  
May 2025
