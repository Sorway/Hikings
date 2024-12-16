document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'URL du fichier GPX à partir de l'attribut data-gpx-url du script
    const scriptTag = document.querySelector('script[src="/javascripts/map.js"]');
    const gpxUrl = scriptTag.getAttribute('data-gpx-url');

    console.log(gpxUrl);

    if (gpxUrl) {
        // Créez la carte et définissez la vue initiale
        const map = L.map('map').setView([48.8588443, 2.2943506], 13);

        // Ajouter la couche de base de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Charger le fichier GPX
        new L.GPX(gpxUrl, {
            async: true,
            marker_options: {
                wptIconUrls: null
            }
        }).on('loaded', function(e) {
            map.fitBounds(e.target.getBounds());
        }).addTo(map);
    } else {
        console.error('URL du fichier GPX non définie.');
    }
});