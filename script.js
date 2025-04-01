let map, marker, watchId;
const statusText = document.getElementById("status");
const latText = document.getElementById("latitude");
const lonText = document.getElementById("longitude");

// Initialisation de la carte Leaflet
function initMap() {
	map = L.map('map').setView([48.8566, 2.3522], 13); // Paris par défaut

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	marker = L.marker([48.8566, 2.3522]).addTo(map)
		.bindPopup("Position en attente...");
}

// Met à jour la position sur la carte
function updatePosition(position) {
	const { latitude, longitude } = position.coords;
	latText.textContent = latitude.toFixed(6);
	lonText.textContent = longitude.toFixed(6);
	statusText.textContent = "✅ Position mise à jour !";

	const newLatLng = [latitude, longitude];
	marker.setLatLng(newLatLng).setPopupContent("📍 Vous êtes ici").openPopup();
	map.setView(newLatLng, 15);
}

// Gestion des erreurs
function error(err) {
	statusText.textContent = "❌ Erreur (${err.code}): ${err.message}";
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