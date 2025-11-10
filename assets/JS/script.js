// js/destinos.js

// Dados dos festivais (extraídos da planilha)
const festivalsData = [
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
    }
    // Adicione mais festivais conforme necessário da sua planilha
];

// Variáveis globais
let map;
let markers = [];
let currentFilters = {
    continente: 'all',
    vertente: 'all',
    status: 'all'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    renderFestivalsList(festivalsData);
    updateStats();
    setupEventListeners();
});

// Inicializar mapa
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    addMarkersToMap(festivalsData);
}

// Adicionar marcadores ao mapa
function addMarkersToMap(festivals) {
    // Limpar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    festivals.forEach(festival => {
        const markerColor = festival.status === 'Ativo' ? '#27ae60' : '#e74c3c';
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const marker = L.marker([festival.lat, festival.lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup(createPopupContent(festival));
        
        markers.push(marker);
    });
}

// Criar conteúdo do popup
function createPopupContent(festival) {
    return `
        <div class="festival-popup">
            <h3>${festival.nome}</h3>
            <div class="location">${festival.pais}, ${festival.continente}</div>
            <div class="genre">${festival.vertente}</div>
            <div class="subgenres">${festival.subvertentes}</div>
            <span class="status ${festival.status === 'Ativo' ? 'status-active' : 'status-inactive'}">
                ${festival.status}
            </span>
        </div>
    `;
}

// Renderizar lista de festivais
function renderFestivalsList(festivals) {
    const container = document.getElementById('festivals-container');
    const countElement = document.getElementById('festival-count');
    
    container.innerHTML = '';
    countElement.textContent = festivals.length;
    
    festivals.forEach(festival => {
        const festivalCard = createFestivalCard(festival);
        container.appendChild(festivalCard);
    });
}

// Criar card de festival
function createFestivalCard(festival) {
    const card = document.createElement('div');
    card.className = `festival-card ${festival.status === 'Inativo' ? 'inactive' : ''}`;
    
    card.innerHTML = `
        <div class="festival-header">
            <div>
                <div class="festival-name">${festival.nome}</div>
                <div class="festival-location">${festival.pais}, ${festival.continente}</div>
            </div>
            <span class="festival-status ${festival.status === 'Ativo' ? 'status-active' : 'status-inactive'}">
                ${festival.status}
            </span>
        </div>
        <div class="festival-genre">${festival.vertente}</div>
        <div class="festival-subgenres">${festival.subvertentes}</div>
    `;
    
    // Adicionar evento de clique para centralizar no mapa
    card.addEventListener('click', () => {
        map.setView([festival.lat, festival.lng], 6);
        markers.forEach(marker => {
            if (marker.getLatLng().lat === festival.lat && marker.getLatLng().lng === festival.lng) {
                marker.openPopup();
            }
        });
    });
    
    return card;
}

// Atualizar estatísticas
function updateStats() {
    const total = festivalsData.length;
    const active = festivalsData.filter(f => f.status === 'Ativo').length;
    const inactive = festivalsData.filter(f => f.status === 'Inativo').length;
    const countries = new Set(festivalsData.map(f => f.pais)).size;
    
    document.getElementById('total-festivals').textContent = total;
    document.getElementById('active-festivals').textContent = active;
    document.getElementById('inactive-festivals').textContent = inactive;
    document.getElementById('countries-count').textContent = countries;
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('continente').addEventListener('change', applyFilters);
    document.getElementById('vertente').addEventListener('change', applyFilters);
    document.getElementById('status').addEventListener('change', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Aplicar filtros
function applyFilters() {
    const continenteFilter = document.getElementById('continente').value;
    const vertenteFilter = document.getElementById('vertente').value;
    const statusFilter = document.getElementById('status').value;
    
    currentFilters = {
        continente: continenteFilter,
        vertente: vertenteFilter,
        status: statusFilter
    };
    
    const filteredFestivals = festivalsData.filter(festival => {
        return (continenteFilter === 'all' || festival.continente === continenteFilter) &&
               (vertenteFilter === 'all' || festival.vertente === vertenteFilter) &&
               (statusFilter === 'all' || festival.status === statusFilter);
    });
    
    renderFestivalsList(filteredFestivals);
    addMarkersToMap(filteredFestivals);
}

// Resetar filtros
function resetFilters() {
    document.getElementById('continente').value = 'all';
    document.getElementById('vertente').value = 'all';
    document.getElementById('status').value = 'all';
    
    applyFilters();
}
