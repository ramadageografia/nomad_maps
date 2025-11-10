// js/trance-map.js

class TranceMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.markerCluster = null;
        this.currentFilters = {
            continente: 'all',
            vertente: 'all',
            status: 'all'
        };
        this.festivalsData = [];
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.initMap();
        this.setupEventListeners();
        this.updateStats();
    }

    async loadData() {
        // Dados dos festivais - você pode substituir por uma chamada API
        this.festivalsData = [
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
                nome: "Nature Frequencies",
                pais: "Alemanha",
                continente: "Europa",
                vertente: "Psytrance - multigênero",
                subvertentes: "Full on, Prog, Night, Forest",
                status: "Inativo",
                lat: 48.7904,
                lng: 11.4979
            }
            // Adicione mais festivais conforme sua planilha
        ];
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
        this.addMarkersToMap(this.festivalsData);
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

    renderFestivalsList(festivals) {
        const container = document.getElementById('festivals-container');
        const countElement = document.getElementById('festival-count');
        
        container.innerHTML = '';
        countElement.textContent = festivals.length;
        
        festivals.forEach(festival => {
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
        const vertenteFilter = document.getElementById('vertente').value;
        const statusFilter = document.getElementById('status').value;
        
        this.currentFilters = {
            continente: continenteFilter,
            vertente: vertenteFilter,
            status: statusFilter
        };
        
        const filteredFestivals = this.festivalsData.filter(festival => {
            return (continenteFilter === 'all' || festival.continente === continenteFilter) &&
                   (vertenteFilter === 'all' || festival.vertente === vertenteFilter) &&
                   (statusFilter === 'all' || festival.status === statusFilter);
        });
        
        this.renderFestivalsList(filteredFestivals);
        this.addMarkersToMap(filteredFestivals);
        this.updateStats();
    }

    updateStats() {
        const filteredData = this.festivalsData.filter(festival => {
            return (this.currentFilters.continente === 'all' || festival.continente === this.currentFilters.continente) &&
                   (this.currentFilters.vertente === 'all' || festival.vertente === this.currentFilters.vertente) &&
                   (this.currentFilters.status === 'all' || festival.status === this.currentFilters.status);
        });
        
        const total = filteredData.length;
        const active = filteredData.filter(f => f.status === 'Ativo').length;
        const countries = new Set(filteredData.map(f => f.pais)).size;
        
        document.getElementById('total-festivals').textContent = total;
        document.getElementById('active-festivals').textContent = active;
        document.getElementById('countries-count').textContent = countries;
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('continente').addEventListener('change', () => this.applyFilters());
        document.getElementById('vertente').addEventListener('change', () => this.applyFilters());
        document.getElementById('status').addEventListener('change', () => this.applyFilters());
        
        // Cluster toggle
        document.getElementById('cluster-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.map.addLayer(this.markerCluster);
            } else {
                this.map.removeLayer(this.markerCluster);
                this.markers.forEach(marker => marker.addTo(this.map));
            }
        });
        
        // Reset view
        document.getElementById('reset-view').addEventListener('click', () => {
            this.map.setView([20, 0], 2);
        });
        
        // Search
        document.getElementById('festival-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = this.festivalsData.filter(festival => 
                festival.nome.toLowerCase().includes(searchTerm) ||
                festival.pais.toLowerCase().includes(searchTerm) ||
                festival.continente.toLowerCase().includes(searchTerm)
            );
            this.renderFestivalsList(filtered);
        });
        
        // Panel toggle
        document.getElementById('toggle-panel').addEventListener('click', () => {
            const panel = document.querySelector('.side-panel');
            const icon = document.querySelector('#toggle-panel i');
            
            if (panel.style.height === '300px') {
                panel.style.height = '100%';
                icon.className = 'fas fa-chevron-up';
            } else {
                panel.style.height = '300px';
                icon.className = 'fas fa-chevron-down';
            }
        });
        
        // Renderizar lista inicial
        this.renderFestivalsList(this.festivalsData);
    }
}

// Inicializar mapa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.tranceMap = new TranceMap();
});
