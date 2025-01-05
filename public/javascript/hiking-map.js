document.addEventListener('DOMContentLoaded', () => {
    const scriptTag = document.querySelector('script[src="/javascript/hiking-map.js"]');
    const gpxUrl = scriptTag.getAttribute('data-gpx-url');

    // Initialisation de la carte Leaflet
    const map = L.map('map-container').setView([46.8, 2.4], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Charger et parser le fichier GPX avec DOMParser
    fetch(gpxUrl)
        .then(response => response.text())
        .then(gpxData => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(gpxData, "application/xml");

            const trackPoints = Array.from(xmlDoc.getElementsByTagName("trkpt"));
            const latLngs = trackPoints.map(point => [
                parseFloat(point.getAttribute("lat")),
                parseFloat(point.getAttribute("lon"))
            ]);

            // Ajout du tracé à la carte
            L.polyline(latLngs, { color: 'blue' }).addTo(map);
            map.fitBounds(L.polyline(latLngs).getBounds()); // Ajuster la vue à la trace
        })
        .catch(error => {
            console.error("Erreur lors du chargement du fichier GPX :", error);
        });
});
