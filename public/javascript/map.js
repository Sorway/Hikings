// Initialisation de la carte avec vue centrée
const map = L.map('map').setView([43.9352, 6.0679], 8);

// Configuration de la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisées
const hikingIcon = L.icon({
    iconUrl: './images/markers/hikings.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const spotIcon = L.icon({
    iconUrl: './images/markers/spots.png',
    iconSize: [32, 32],
    popupAnchor: [0, -32]
});

// Stockage des marqueurs pour filtrage
const markers = [];

// Fonction générique pour charger des marqueurs
function loadMarkers(url, icon, imageFolder, tagClass, entityType) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const popupContent = `
                    <div class="popup-container">
                        <div class="popup-header">
                            <h3 class="popup-title">${item.name}</h3>
                            <p class="popup-location">
                                📍 <span class="popup-city">${item.city || ''}</span>
                                ${item.department ? `, ${item.department}` : ''}
                                ${item.region ? `<br><span class="popup-region">${item.region}</span>` : ''}
                            </p>
                        </div>
                        <div class="popup-body">
                            <a href="/${imageFolder.toLowerCase()}/${item.folder}" class="popup-link">Cliquez ici pour plus d'informations</a>
                            <img src="./images/${imageFolder.toLowerCase()}/${item.folder}/${item.image}" alt="${item.name}" class="popup-image">
                        </div>
                    </div>
                `;

                const marker = L.marker(item.coordinates, { icon: icon }).addTo(map);
                marker.bindPopup(popupContent).on('click', () => {
                    map.setView(marker.getLatLng(), map.getZoom(), { animate: true });
                    marker.openPopup();
                });

                markers.push({
                    marker,
                    data: item,
                    imageFolder,
                    tagClass,
                    entityType
                });
            });

            updateSidebar(); // Initial update for the sidebar
        })
        .catch(error => console.error(`Erreur lors du chargement des ${entityType.toLowerCase()}s:`, error));
}

// Fonction pour mettre à jour la sidebar en fonction des randonnées visibles
function updateSidebar() {
    const listContainer = document.getElementById('hike-list');
    listContainer.innerHTML = ''; // Clear previous items
    const bounds = map.getBounds(); // Obtenir les limites actuelles de la carte

    markers.forEach(({ marker, data, imageFolder, tagClass, entityType }) => {
        if (bounds.contains(marker.getLatLng())) {
            const listItem = document.createElement('li');
            listItem.className = 'hike-item';
            listItem.innerHTML = `
                <div class="hike-card">
                    <div class="hike-image-container">
                        <img src="./images/${imageFolder}/${data.folder}/${data.image}" alt="${data.name}" class="hike-image">
                    </div>
                    <div class="hike-details">
                        <h3>${data.name}</h3>
                        <p>${data.region || ''}</p>
                        <button class="go-to-marker-btn">Voir sur la carte</button>
                    </div>
                </div>
            `;

            // Event listener pour centrer la carte lorsque l'utilisateur clique sur l'itinéraire dans la sidebar
            listItem.querySelector('.go-to-marker-btn').addEventListener('click', () => {
                map.setView(marker.getLatLng(), 13, { animate: true });
                marker.openPopup();
            });

            listContainer.appendChild(listItem);
        }
    });
}

// Événement "moveend" pour mettre à jour la sidebar lorsque la carte est déplacée ou zoomée
map.on('moveend', updateSidebar);

// Chargement des randonnées et spots
loadMarkers('https://hikings.jonathan-gp.fr/api/hikings', hikingIcon, 'hikings', 'tag-hiking', 'Randonnée');
loadMarkers('https://hikings.jonathan-gp.fr/api/spots', spotIcon, 'spots', 'tag-spot', 'Spot Photo');