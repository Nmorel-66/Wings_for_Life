let map, marker, watchId;
const statusText = document.getElementById("status");
const latText = document.getElementById("latitude");
const lonText = document.getElementById("longitude");
const speedText = document.getElementById("speed"); // Élément pour afficher la vitesse

let lastPosition = null; // Dernière position enregistrée
let lastTime = null; // Temps de la dernière position

// Fonction pour calculer la distance entre deux coordonnées (en km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);  // Conversion en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
}

// Met à jour la position et calcule la vitesse
function updatePosition(position) {
    const { latitude, longitude } = position.coords;
    
    latText.textContent = latitude.toFixed(6);
    lonText.textContent = longitude.toFixed(6);

    let speedKmH = 0;
    if (lastPosition && lastTime) {
        // Calculer la distance entre la dernière position et la nouvelle position
        const distance = calculateDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
        
        // Calculer le temps écoulé (en secondes) entre les deux positions
        const timeElapsed = (position.timestamp - lastTime) / 1000; // Convertir en secondes
        
        // Calculer la vitesse (distance / temps) en km/h
        if (timeElapsed > 0) {
            speedKmH = (distance / timeElapsed) * 3600; // Convertir la vitesse en km/h
        }
    }

    // Afficher la vitesse
    speedText.textContent = speedKmH.toFixed(2) + " km/h"; // Afficher la vitesse

    // Mettre à jour la position sur la carte
    const newLatLng = [latitude, longitude];
    marker.setLatLng(newLatLng).setPopupContent("📍 Vous êtes ici").openPopup();
    map.setView(newLatLng, 15);

    // Sauvegarder la nouvelle position et le temps actuel pour le prochain calcul
    lastPosition = { latitude, longitude };
    lastTime = position.timestamp;
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
            timeout: 5000,   // Si la position n'est pas mise à jour dans ce délai, une erreur sera générée
            maximumAge: 0    // Ne pas utiliser la position mise en cache, toujours récupérer une nouvelle position
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

// Initialiser la carte et démarrer le suivi
window.onload = function () {
    map = L.map('map').setView([48.8566, 2.3522], 13); // Paris par défaut

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([48.8566, 2.3522]).addTo(map)
        .bindPopup("Position en attente...");

    startTracking(); // Commencer le suivi GPS
};