
// Variáveis globais
let map;
let currentLayer = 'name';
let allMarkers = [];
let visibleMarkers = [];

// Aguardar o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 NOMAD MAPS - Iniciando mapa...');
    
    // Inicializar Mapa
    map = L.map('map').setView([20, 0], 2);

    // Adicionar Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Carregar camada inicial (POR NOME)
    loadNameLayer();
    
    // Configurar filtros
    setupFilters();
    
    // Atualizar estatísticas
    updateStats();

    console.log('✅ NOMAD MAPS - Mapa carregado com sucesso!');
    console.log(`📍 ${festivalsData.length} festivais carregados`);
});

// Sistema de camadas
function switchLayer(layerType) {
    currentLayer = layerType;
    
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar nome da camada
    const layerNames = {
        'name': 'Visualizando por Nome',
        'country': 'Visualizando por País', 
        'genre': 'Visualizando por Subvertente'
    };
    document.getElementById('currentLayerName').textContent = layerNames[layerType];
    
    // Limpar e recarregar
    clearAllMarkers();
    
    switch(layerType) {
        case 'name':
            loadNameLayer();
            break;
        case 'country':
            loadCountryLayer();
            break;
        case 'genre':
            loadGenreLayer();
            break;
    }
    
    updateStats();
}

// CAMADA POR NOME - Com ícones personalizados
function loadNameLayer() {
    console.log('🎵 Carregando camada por nome...');
    
    festivalsData.forEach(festival => {
        const icon = createFestivalIcon(festival);
        
        const marker = L.marker(festival.coordinates, { 
            icon: icon,
            festival: festival
        }).bindPopup(createFestivalPopup(festival));
        
        marker.on('click', function() {
            highlightFestivalInSidebar(festival.name);
        });
        
        allMarkers.push(marker);
        visibleMarkers.push(marker);
        marker.addTo(map);
    });
    
    updateSidebarList();
}

// Criar ícone personalizado para festival
function createFestivalIcon(festival) {
    // Cores por subvertente principal
    const colorMap = {
        'Darkpsy': '#8B5CF6',    // Roxo
        'Hitech Psytrance': '#06B6D4', // Ciano
        'Full on': '#EF4444',    // Vermelho
        'Prog': '#10B981',       // Verde
        'Forest': '#22C55E',     // Verde floresta
        'Night': '#6366F1',      // Índigo
        'Goa': '#F59E0B',        // Âmbar
        'Core': '#DC2626'        // Vermelho escuro
    };
    
    let color = '#3B82F6'; // Azul padrão
    
    // Encontrar cor baseada nas subvertentes
    for (const [key, value] of Object.entries(colorMap)) {
        if (festival.subgenres.includes(key)) {
            color = value;
            break;
        }
    }
    
    // Ícone baseado no tipo
    let iconHtml = '🎵'; // Ícone padrão música
    
    if (festival.subgenres.includes('Forest')) iconHtml = '🌲';
    else if (festival.subgenres.includes('Night')) iconHtml = '🌙';
    else if (festival.subgenres.includes('Goa')) iconHtml = '☮️';
    else if (festival.subgenres.includes('Darkpsy')) iconHtml = '👁️';
    else if (festival.subgenres.includes('Hitech')) iconHtml = '⚡';
    
    return L.divIcon({
        className: 'festival-marker',
        html: `
            <div style="
                background: ${color};
                width: 36px;
                height: 36px;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                color: white;
                font-weight: bold;
            ">
                ${iconHtml}
            </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
    });
}

// Criar popup do festival
function createFestivalPopup(festival) {
    const subgenres = festival.subgenres.split(', ').map(genre => 
        `<span style="
            background: rgba(233, 196, 106, 0.2);
            color: #e9c46a;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 0.7rem;
            margin: 2px;
            display: inline-block;
        ">${genre}</span>`
    ).join('');
    
    return `
        <div class="festival-popup">
            <div class="festival-name">${festival.name}</div>
            <div class="festival-info">
                <strong>📍 Localização:</strong> ${festival.country}, ${festival.continent}<br>
                <strong>🎵 Gênero:</strong> ${festival.main_genre}<br>
                <strong>🔊 Subvertentes:</strong><br>
                ${subgenres}<br>
                <strong>📅 Status:</strong> 
                <span class="festival-status ${festival.status === 'Ativo' ? 'ativo' : 'inativo'}">
                    ${festival.status}
                </span>
            </div>
        </div>
    `;
}

// Atualizar sidebar com lista de festivais
function updateSidebarList() {
    const listContainer = document.getElementById('festivalsList');
    
    const festivalList = visibleMarkers.map(marker => {
        const festival = marker.options.festival;
        return `
            <div class="festival-card" onclick="zoomToFestival('${festival.name}')" data-festival="${festival.name}">
                <div class="festival-name">${festival.name}</div>
                <div class="festival-location">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${festival.country} • ${festival.continent}
                </div>
                <div class="festival-meta">
                    <span class="festival-genre">${getMainSubgenre(festival.subgenres)}</span>
                    <span class="festival-status ${festival.status === 'Ativo' ? 'ativo' : 'inativo'}">
                        ${festival.status}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    listContainer.innerHTML = festivalList || '<div class="text-muted p-3">Nenhum festival encontrado</div>';
}

// Obter subgênero principal
function getMainSubgenre(subgenres) {
    const genres = subgenres.split(', ');
    return genres[0] || 'Psytrance';
}

// Destacar festival na sidebar
function highlightFestivalInSidebar(festivalName) {
    document.querySelectorAll('.festival-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.festival === festivalName) {
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Zoom para festival
function zoomToFestival(festivalName) {
    const festival = festivalsData.find(f => f.name === festivalName);
    if (festival) {
        map.setView(festival.coordinates, 8);
        
        // Abrir popup
        const marker = allMarkers.find(m => m.options.festival.name === festivalName);
        if (marker) {
            marker.openPopup();
        }
    }
}

// Configurar filtros
function setupFilters() {
    // Países
    const countries = [...new Set(festivalsData.map(f => f.country))].sort();
    const countrySelect = document.getElementById('countryFilter');
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    
    // Subvertentes
    const allSubgenres = new Set();
    festivalsData.forEach(festival => {
        festival.subgenres.split(', ').forEach(genre => allSubgenres.add(genre));
    });
    
    const subgenreSelect = document.getElementById('subgenreFilter');
    [...allSubgenres].sort().forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        subgenreSelect.appendChild(option);
    });
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('countryFilter').addEventListener('change', applyFilters);
    document.getElementById('subgenreFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
}

// Aplicar filtros
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const country = document.getElementById('countryFilter').value;
    const subgenre = document.getElementById('subgenreFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    // Limpar marcadores visíveis
    visibleMarkers.forEach(marker => map.removeLayer(marker));
    visibleMarkers = [];
    
    // Filtrar marcadores
    allMarkers.forEach(marker => {
        const festival = marker.options.festival;
        let visible = true;
        
        if (searchTerm && !festival.name.toLowerCase().includes(searchTerm)) {
            visible = false;
        }
        if (country && festival.country !== country) {
            visible = false;
        }
        if (subgenre && !festival.subgenres.includes(subgenre)) {
            visible = false;
        }
        if (status && festival.status !== status) {
            visible = false;
        }
        
        if (visible) {
            map.addLayer(marker);
            visibleMarkers.push(marker);
        }
    });
    
    updateSidebarList();
    updateStats();
}

// Atualizar estatísticas
function updateStats() {
    const totalFestivals = festivalsData.length;
    const totalCountries = new Set(festivalsData.map(f => f.country)).size;
    const visibleCount = visibleMarkers.length;
    
    document.getElementById('totalFestivals').textContent = totalFestivals;
    document.getElementById('totalCountries').textContent = totalCountries;
    document.getElementById('visibleFestivals').textContent = visibleCount;
}

// Limpar todos os marcadores
function clearAllMarkers() {
    allMarkers.forEach(marker => map.removeLayer(marker));
    visibleMarkers.forEach(marker => map.removeLayer(marker));
    allMarkers = [];
    visibleMarkers = [];
}

// Funções para outras camadas
function loadCountryLayer() {
    console.log('🏴 Camada por país - Em desenvolvimento...');
    // Implementar depois
    updateSidebarList();
}

function loadGenreLayer() {
    console.log('👽 Camada por subvertente - Em desenvolvimento...');
    // Implementar depois  
    updateSidebarList();
}