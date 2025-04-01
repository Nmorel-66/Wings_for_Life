let map, marker, watchId;
const statusText = document.getElementById("status");
const latText = document.getElementById("latitude");
const lonText = document.getElementById("longitude");
const speedText = document.getElementById("speed"); // Ajouter un élément pour afficher la vitesse

// Initialisation de la carte Leaflet
function initMap() {
    map = L.map('map').setView([48.8566, 2.3522], 13); // Paris par défaut

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([48.8566, 2.3522]).addTo(map)
        .bindPopup("Position en attente...");
}

// Met à jour la position et la vitesse sur la carte
function updatePosition(position) {
    const { latitude, longitude, speed } = position.coords;

    latText.textContent = latitude.toFixed(6);
    lonText.textContent = longitude.toFixed(6);
    
    // Afficher la vitesse
    let speedKmH = 0;
    if (speed !== null) {
        speedKmH = (speed * 3.6).toFixed(2); // Convertir la vitesse en m/s en km/h
    }

    speedText.textContent = speedKmH; // Affiche la vitesse en km/h
    statusText.textContent = "✅ Position mise à jour !";

    const newLatLng = [latitude, longitude];
    marker.setLatLng(newLatLng).setPopupContent("📍 Vous êtes ici").openPopup();
    map.setView(newLatLng, 15);
}

// Gestion des erreurs
function error(err) {
    statusText.textContent = `❌ Erreur (${err.code}): ${err.message}`;
}

// Lancer le suivi GPS
function startTracking() {
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(updatePosition, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        statusText.textContent = "❌ La géolocalisation n'est pas prise en charge.";
    }
}

// Arrêter le suivi GPS
function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        statusText.textContent = "🛑 Suivi arrêté.";
    }
}

// Lancer la carte et le suivi au chargement
window.onload = function () {
    initMap();
    startTracking();
};