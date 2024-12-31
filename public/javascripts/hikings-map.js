// Initialisation de la carte
const map = L.map('map').setView([43.9352, 6.0679], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function fetchAndDisplayHikings() {
    try {
        const response = await fetch('http://localhost/api/v1/hikings');
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const hikings = await response.json();

        if (!hikings.length) {
            alert('Aucune randonnée trouvée.');
            return;
        }

        const hikingList = document.getElementById('hiking-list');
        const markers = [];

        function createHikingItem(hiking, marker) {
            const { name, city, department, region, folder, image } = hiking;
            const hikingItem = document.createElement('div');
            hikingItem.className = 'hiking-item';
            hikingItem.innerHTML = `
                <strong>${name}</strong><br>
                📍 <span style="color: var(--primary-color);">${city || ''}</span>
                ${department ? `, ${department}` : ''}
                ${region ? `<br> (<span style="color: var(--secondary-color);">${region}</span>)` : ''}<br>
                <img src="./images/hikings/${folder}/${image}" alt="${name}" class="popup-image">
            `;
            hikingItem.addEventListener('click', () => {
                map.setView(marker.getLatLng(), 12);
                marker.openPopup();
            });
            return hikingItem;
        }

        function updateVisibleHikings() {
            const bounds = map.getBounds();
            hikingList.innerHTML = '';

            markers.forEach(({ marker, hiking }) => {
                if (bounds.contains(marker.getLatLng())) {
                    const hikingItem = createHikingItem(hiking, marker);
                    hikingList.appendChild(hikingItem);
                }
            });
        }

        hikings.forEach((hiking) => {
            const { name, coordinates, city, department, region, folder, image } = hiking;

            if (!Array.isArray(coordinates) || coordinates.length !== 2 || coordinates.some(isNaN)) {
                console.warn(`Coordonnées invalides pour la randonnée "${name}"`);
                return;
            }

            const popupContent = `
                <b>${name}</b><br>
                📍 <span style="color: var(--primary-color);">${city || ''}</span>
                ${department ? `, ${department}` : ''}
                ${region ? `<br> (<span style="color: var(--secondary-color);">${region}</span>)` : ''}<br>
                <a href="/hiking/${folder}" class="bind-button">Cliquez-Ici pour plus d'information</a><br>
                <img src="./images/hikings/${folder}/${image}" alt="${name}" class="popup-image">
            `;

            const marker = L.marker(coordinates).addTo(map).bindPopup(popupContent);

            marker.on('popupopen', () => {
                map.setView(marker.getLatLng(), 12);
            });

            markers.push({ marker, hiking });
        });

        updateVisibleHikings();

        map.on('moveend', updateVisibleHikings);
    } catch (error) {
        console.error('Erreur lors de la récupération des randonnées :', error);
        alert('Impossible de charger les randonnées. Veuillez vérifier le serveur.');
    }
}

fetchAndDisplayHikings().then(() => console.log('fetchAndDisplayHikings terminé.'));
