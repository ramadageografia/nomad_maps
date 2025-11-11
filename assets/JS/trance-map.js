// assets/JS/trance-map.js

// Dados completos dos festivais (baseado na sua planilha)
const FESTIVALS_DATA = [
    {
        nome: "Nataraja Festival",
        pais: "França",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 46.0201,
        lng: 3.7616
    },
    {
        nome: "Nature Frequencies",
        pais: "Alemanha",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Inativo",
        lat: 48.7904,
        lng: 11.4979
    },
    {
        nome: "Alien Safari",
        pais: "África do Sul",
        continente: "África",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Inativo",
        lat: -31.388542,
        lng: 24.284814
    },
    {
        nome: "Indian Spirit",
        pais: "Alemanha",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 53.2623,
        lng: 11.4153
    },
    {
        nome: "Antaris Project",
        pais: "Alemanha",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Inativo",
        lat: 52.7388,
        lng: 12.3821
    },
    {
        nome: "Shankra Festival",
        pais: "Suíça",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 46.3439,
        lng: 9.1011
    },
    {
        nome: "Vuuv Festival",
        pais: "Alemanha",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 52.8625,
        lng: 12.1538
    },
    {
        nome: "Envision Festival",
        pais: "Costa Rica",
        continente: "América Central",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 10.446698,
        lng: -83.312888
    },
    {
        nome: "Lucidity Festival",
        pais: "EUA",
        continente: "América do Norte",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 34.4208,
        lng: -119.6982
    },
    {
        nome: "Eclipse Festival",
        pais: "Canadá",
        continente: "América do Norte",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 46.8139,
        lng: -71.208
    },
    {
        nome: "Jacundá Trance Festival",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Inativo",
        lat: -2.548959,
        lng: -60.145092
    },
    {
        nome: "Mundo de Oz",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -23.100547,
        lng: -45.170907
    },
    {
        nome: "High Stage",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Hitech Psytrance",
        subvertentes: "Hitech, Darkpsy, Core",
        status: "Ativo",
        lat: -23.08043,
        lng: -45.20952
    },
    {
        nome: "Hitech Revolution",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Hitech, Darkpsy, Core",
        status: "Ativo",
        lat: -23.078685,
        lng: -45.178715
    },
    {
        nome: "Swampy Festival",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -21.060319,
        lng: -44.845167
    },
    {
        nome: "Universo Paralello",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -13.512251,
        lng: -38.92635
    },
    {
        nome: "Undervision Festival",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -28.78656,
        lng: -52.07779
    },
    {
        nome: "Earthdance Festival",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -30.023123,
        lng: -50.550707
    },
    {
        nome: "Zion Festival",
        pais: "Brasil",
        continente: "América do Sul",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -30.93924,
        lng: -53.588792
    },
    {
        nome: "Boom Festival",
        pais: "Portugal",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 39.784492,
        lng: -7.45194
    },
    {
        nome: "Ozora Festival",
        pais: "Hungria",
        continente: "Europa",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 46.779312,
        lng: 18.410091
    },
    {
        nome: "Mo:dem Festival",
        pais: "Croácia",
        continente: "Europa",
        vertente: "Darkpsy",
        subvertentes: "Hitech, Darkpsy, Core",
        status: "Ativo",
        lat: 45.216951,
        lng: 15.471648
    },
    {
        nome: "Fractal Festival",
        pais: "Namíbia",
        continente: "África",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -21.845339,
        lng: 15.177458
    },
    {
        nome: "Karacus Maracus",
        pais: "Índia",
        continente: "Ásia",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: 14.986373,
        lng: 74.064123
    },
    {
        nome: "Lost in Paradise",
        pais: "Nova Zelândia",
        continente: "Oceania",
        vertente: "Psytrance - multigênero",
        subvertentes: "Full on, Prog, Night, Forest",
        status: "Ativo",
        lat: -35.725995,
        lng: 174.320699
    }
];

class TranceMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.markerCluster = null;
        this.currentFestivals = [];
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
    }

    initMap() {
        // Inicializar mapa
        this.map = L.map('trance-map').setView([20, 0], 2);
        
        // Adicionar tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Nomad Maps',
            maxZoom: 18
        }).addTo(this.map);
        
        // Inicializar cluster
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
        // Limpar marcadores existentes
        this.markerCluster.clearLayers();
        this.markers = [];
        
        festivals.forEach(festival => {
            const marker = this.createMarker(festival);
            this.markers.push(marker);
            this.markerCluster.addLayer(marker);
        });
    }

    createMarker(festival) {
        const markerColor = festival.status === 'Ativo' ? '#27ae60' : '#e74c3c';
        const icon = L.divIcon({
            className: 'trance-marker',
            html: `
                <div style="
                    background-color: ${markerColor};
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;
                "></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
        });
        
        const marker = L.marker([festival.lat, festival.lng], { icon: icon });
        
        marker.bindPopup(this.createPopupContent(festival));
        
        marker.on('click', () => {
            this.highlightFestivalInList(festival.nome);
        });
        
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

    renderFestivalsList() {
        const container = document.getElementById('festivals-container');
        const countElement = document.getElementById('festival-count');
        
        container.innerHTML = '';
        countElement.textContent = this.currentFestivals.length;
        
        this.currentFestivals.forEach(festival => {
            const festivalCard = this.createFestivalCard(festival);
            container.appendChild(festivalCard);
        });
    }

    createFestivalCard(festival) {
        const card = document.createElement('div');
        card.className = `festival-card ${festival.status === 'Inativo' ? 'inactive' : ''}`;
        card.dataset.festivalName = festival.nome;
        
        card.innerHTML = `
            <div class="festival-header">
                <div>
                    <div class="festival-name">${festival.nome}</div>
                    <div class="festival-location">📍 ${festival.pais}, ${festival.continente}</div>
                </div>
                <span class="festival-status ${festival.status === 'Ativo' ? 'status-active' : 'status-inactive'}">
                    ${festival.status}
                </span>
            </div>
            <div class="festival-genre">🎵 ${festival.vertente}</div>
            <div class="festival-subgenres">${festival.subvertentes}</div>
        `;
        
        card.addEventListener('click', () => {
            this.centerMapOnFestival(festival);
            this.highlightFestivalInList(festival.nome);
        });
        
        return card;
    }

    centerMapOnFestival(festival) {
        this.map.setView([festival.lat, festival.lng], 6);
        
        // Abrir popup do marcador
        this.markers.forEach(marker => {
            const latLng = marker.getLatLng();
            if (latLng.lat === festival.lat && latLng.lng === festival.lng) {
                marker.openPopup();
            }
        });
    }

    highlightFestivalInList(festivalName) {
        // Remover destaque anterior
        document.querySelectorAll('.festival-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Destacar card atual
        const activeCard = document.querySelector(`[data-festival-name="${festivalName}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    applyFilters() {
        const continenteFilter = document.getElementById('continente').value;
        const statusFilter = document.getElementById('status').value;
        const searchFilter = document.getElementById('festival-search').value.toLowerCase();
        
        this.filters = {
            continente: continenteFilter,
            status: statusFilter,
            search: searchFilter
        };
        
        this.currentFestivals = FESTIVALS_DATA.filter(festival => {
            const matchesContinente = continenteFilter === 'all' || festival.continente === continenteFilter;
            const matchesStatus = statusFilter === 'all' || festival.status === statusFilter;
            const matchesSearch = searchFilter === '' || 
                festival.nome.toLowerCase().includes(searchFilter) ||
                festival.pais.toLowerCase().includes(searchFilter) ||
                festival.continente.toLowerCase().includes(searchFilter);
            
            return matchesContinente && matchesStatus && matchesSearch;
        });
        
        this.renderFestivalsList();
        this.addMarkersToMap(this.currentFestivals);
        this.updateStats();
    }

    updateStats() {
        const total = this.currentFestivals.length;
        const active = this.currentFestivals.filter(f => f.status === 'Ativo').length;
        const countries = new Set(this.currentFestivals.map(f => f.pais)).size;
        
        document.getElementById('total-festivals').textContent = total;
        document.getElementById('active-festivals').textContent = active;
        document.getElementById('countries-count').textContent = countries;
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('continente').addEventListener('change', () => this.applyFilters());
        document.getElementById('status').addEventListener('change', () => this.applyFilters());
        
        // Search
        document.getElementById('festival-search').addEventListener('input', () => this.applyFilters());
        
        // Reset filters
        document.getElementById('reset-filters').addEventListener('click', () => {
            document.getElementById('continente').value = 'all';
            document.getElementById('status').value = 'all';
            document.getElementById('festival-search').value = '';
            this.applyFilters();
        });
        
        // Reset view
        document.getElementById('reset-view').addEventListener('click', () => {
            this.map.setView([20, 0], 2);
        });
    }
}

// Inicializar mapa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.tranceMap = new TranceMap();
});
