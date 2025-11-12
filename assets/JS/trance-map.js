// assets/JS/trance-map.js

const FESTIVALS_DATA = [...]; // (mantenha seus dados aqui, exatamente como estão)

class TranceMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.markerCluster = null;
        this.currentFestivals = [];
        this.flyerPopup = null; // elemento do flyer flutuante

        this.filters = {
            continente: 'all',
            status: 'all',
            search: ''
        };

        this.init();
    }

    init() {
        this.currentFestivals = [...FESTIVALS_DATA];
        this.initMap();
        this.renderFestivalsList();
        this.updateStats();
        this.setupEventListeners();
        this.createFlyerPopup();
    }

    createFlyerPopup() {
        // Cria o elemento que mostrará o flyer flutuante
        this.flyerPopup = document.createElement('div');
        this.flyerPopup.id = 'flyer-popup';
        this.flyerPopup.style.position = 'absolute';
        this.flyerPopup.style.display = 'none';
        this.flyerPopup.style.pointerEvents = 'none';
        this.flyerPopup.style.zIndex = 9999;
        this.flyerPopup.style.borderRadius = '10px';
        this.flyerPopup.style.overflow = 'hidden';
        this.flyerPopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        this.flyerPopup.style.transition = 'opacity 0.2s ease';
        document.body.appendChild(this.flyerPopup);
    }

    showFlyerPopup(e, festivalName) {
        const flyerPath = `assets/Imagens/flyers/${festivalName}/flyer.jpg`;
        this.flyerPopup.innerHTML = `<img src="${flyerPath}" style="width:250px; height:auto; display:block;">`;
        this.flyerPopup.style.left = e.originalEvent.pageX + 15 + 'px';
        this.flyerPopup.style.top = e.originalEvent.pageY - 20 + 'px';
        this.flyerPopup.style.display = 'block';
        this.flyerPopup.style.opacity = 1;
    }

    hideFlyerPopup() {
        this.flyerPopup.style.display = 'none';
        this.flyerPopup.style.opacity = 0;
    }

    initMap() {
        this.map = L.map('trance-map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Nomad Maps',
            maxZoom: 18
        }).addTo(this.map);

        this.markerCluster = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true
        });

        this.map.addLayer(this.markerCluster);
        this.addMarkersToMap(this.currentFestivals);
    }

    addMarkersToMap(festivals) {
        this.markerCluster.clearLayers();
        this.markers = [];

        festivals.forEach(festival => {
            const marker = this.createMarker(festival);
            this.markers.push(marker);
            this.markerCluster.addLayer(marker);
        });
    }

    createMarker(festival) {
        const iconUrl = `assets/Imagens/icones/${festival.nome}/icone.png`;
        const markerIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
            className: 'festival-icon'
        });

        const marker = L.marker([festival.lat, festival.lng], { icon: markerIcon });

        marker.bindPopup(this.createPopupContent(festival));

        marker.on('mouseover', (e) => this.showFlyerPopup(e, festival.nome));
        marker.on('mousemove', (e) => {
            this.flyerPopup.style.left = e.originalEvent.pageX + 15 + 'px';
            this.flyerPopup.style.top = e.originalEvent.pageY - 20 + 'px';
        });
        marker.on('mouseout', () => this.hideFlyerPopup());

        marker.on('click', () => this.highlightFestivalInList(festival.nome));

        return marker;
    }

    createPopupContent(festival) {
        return `
            <div class="festival-popup">
                <h3>${festival.nome}</h3>
                <div class="location">📍 ${festival.pais}, ${festival.continente}</div>
                <div class="genre">🎵 ${festival.vertente}</div>
                <div class="subgenres">${festival.subvertentes}</div>
                <span class="status ${festival.status === 'Ativo' ? 'status-active' : 'status-inactive'}">
                    ${festival.status}
                </span>
            </div>
        `;
    }

    // ... (mantém as funções renderFestivalsList, createFestivalCard, centerMapOnFestival, etc. como estão)

}

// Inicializar mapa
document.addEventListener('DOMContentLoaded', () => {
    window.tranceMap = new TranceMap();
});
