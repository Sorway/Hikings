const toggleViewBtn = document.getElementById('toggle-view-btn');
const buttonIcon = document.getElementById('button-icon'); // Icône dans le bouton
const sidebar = document.querySelector('.sidebar');
const mapContainer = document.getElementById('map');

let isMapVisible = false;
let hasZoomAdjusted = false;

// Fonction pour basculer entre carte et liste sur mobile
function toggleView() {
    if (isMapVisible) {
        // Afficher la liste
        sidebar.style.display = 'block';
        mapContainer.style.display = 'none';
        buttonIcon.className = 'fa-solid fa-map'; // Changer l'icône vers "carte"
        toggleViewBtn.innerHTML = `<i id="button-icon" class="fa-solid fa-map"></i> Carte`; // Garder l'icône avec le texte
    } else {
        // Afficher la carte
        sidebar.style.display = 'none';
        mapContainer.style.display = 'block';
        buttonIcon.className = 'fa-solid fa-list'; // Changer l'icône vers "liste"
        toggleViewBtn.innerHTML = `<i id="button-icon" class="fa-solid fa-list"></i> Liste`;

        if (!hasZoomAdjusted) {
            const currentZoom = map.getZoom();
            map.setZoom(currentZoom - 1); // Réduire le zoom d'un cran
            hasZoomAdjusted = true; // Marquer comme déjà ajusté
        }

        setTimeout(() => {
            map.invalidateSize(); // Recalculer la taille de la carte après affichage
        }, 200);
    }
    isMapVisible = !isMapVisible;
}

// Événement du bouton sur mobile
toggleViewBtn.addEventListener('click', toggleView);

// Fonction pour basculer entre carte et sidebar
function showSidebarAfterDelay() {
    // Afficher la carte d'abord
    sidebar.style.display = 'none';
    mapContainer.style.display = 'block';
    toggleViewBtn.style.display = 'none'; // Cacher le bouton au début

    // Basculer sur la sidebar après 2 secondes
    setTimeout(() => {
        sidebar.style.display = 'block';
        mapContainer.style.display = 'none';
        toggleViewBtn.style.display = 'block'; // Réafficher le bouton en mode mobile
        isMapVisible = false; // Réinitialisation de l'état
        updateSidebar(); // Mettre à jour la sidebar avec les randonnées visibles
    }, 1); // 2 secondes
}

// Gestion du comportement sur redimensionnement
function handleResize() {
    if (window.innerWidth <= 768) {
        showSidebarAfterDelay();
    } else {
        // Desktop : afficher carte et liste côte à côte
        sidebar.style.display = 'block';
        mapContainer.style.display = 'block';
        toggleViewBtn.style.display = 'none'; // Cacher le bouton bascule
    }
}

// Appeler handleResize au chargement de la page et lors des changements de taille de la fenêtre
window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', () => {
    handleResize();
    map.invalidateSize();
});
