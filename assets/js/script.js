// Configurações e constantes
const SUBVERTENTE_COLORS = {
    'Full on': '#FF6B6B',
    'Prog': '#4ECDC4', 
    'Forest': '#96CEB4',
    'Darkpsy': '#6A0DAD',
    'Core': '#FFEAA7',
    'Hitech': '#FFA500',
    'Night': '#2C3E50',
    'Goa': '#E74C3C'
};

const CONTINENT_COLORS = {
    'América do Sul': '#FF6B6B', 
    'América do Norte': '#4ECDC4', 
    'América Central': '#45B7D1',
    'Europa': '#96CEB4', 
    'Ásia': '#FFEAA7', 
    'África': '#DDA0DD', 
    'Oceania': '#98D8C8'
};

// Estado da aplicação
let currentFilters = { 
    continente: 'all', 
    subvertente: 'all', 
    status: 'all', 
    search: '' 
};

let map = null;
let allMarkers = [];
let markerCluster = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    renderStats();
    renderFilters();
    renderLegends();
    setupPackagesFilters();
});

// Funções do Mapa
function initializeMap() {
    map = L.map('interactive-map', {
        zoomControl: true,
        preferCanvas: true
    }).setView([20, 0], 2);

    // Camadas base
    const esriSatellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles © Esri',
            maxZoom: 20
        }
    );

    const osm = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap',
            maxZoom: 20
        }
    );

    const googleHybrid = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        {
            attribution: '© Google',
            maxZoom: 20
        }
    );

    esriSatellite.addTo(map);

    // Controle de camadas
    L.control.layers({
        "Satélite (ESRI)": esriSatellite,
        "OpenStreetMap": osm,
        "Google Híbrido": googleHybrid
    }).addTo(map);

    // Controles
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Carregar marcadores
    addMarkersToMap(festivalsData);
}

// Funções de renderização
function renderStats() {
    const filtered = filterFestivals();
    const stats = calculateStats(filtered);
    
    document.getElementById('stats-container').innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total de Festivais</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.active}</div>
            <div class="stat-label">Festivais Ativos</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.countries}</div>
            <div class="stat-label">Países</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.continents}</div>
            <div class="stat-label">Continentes</div>
        </div>
    `;
}

function renderFilters() {
    const continents = [...new Set(festivalsData.map(f => f.continente))];
    const allSubvertentes = festivalsData.flatMap(f => f.subvertentes.split(', ').map(s => s.trim()));
    const uniqueSubvertentes = [...new Set(allSubvertentes)].filter(s => s);
    
    document.getElementById('filters-container').innerHTML = `
        <input type="text" id="search-input" class="search-box" placeholder="🔍 Buscar festival...">
        
        <div class="filter-group">
            <h3>🌍 Continente</h3>
            <div class="filter-options" id="continent-filters">
                <button class="filter-btn active" data-continent="all">Todos</button>
                ${continents.map(c => `<button class="filter-btn" data-continent="${c}">${c}</button>`).join('')}
            </div>
        </div>

        <div class="filter-group">
            <h3>🎵 Subvertentes</h3>
            <div class="filter-options" id="genre-filters">
                <button class="filter-btn active" data-subvertente="all">Todos</button>
                ${uniqueSubvertentes.map(s => `<button class="filter-btn" data-subvertente="${s}">${s}</button>`).join('')}
            </div>
        </div>

        <div class="filter-group">
            <h3>📊 Status</h3>
            <div class="filter-options" id="status-filters">
                <button class="filter-btn active" data-status="all">Todos</button>
                <button class="filter-btn" data-status="Ativo">Ativos</button>
                <button class="filter-btn" data-status="Inativo">Inativos</button>
            </div>
        </div>

        <button id="reset-filters" class="filter-btn" style="width: 100%; margin-top: 10px; background: var(--accent);">
            🔄 Limpar Filtros
        </button>
    `;
}

function renderLegends() {
    document.getElementById('legends-container').innerHTML = `
        <div class="legend">
            <h4>Continentes</h4>
            <div class="legend-items">
                ${Object.entries(CONTINENT_COLORS).map(([name, color]) => `
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: ${color};"></div>
                        <span>${name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="legend">
            <h4>Subvertentes</h4>
            <div class="legend-items">
                ${Object.entries(SUBVERTENTE_COLORS).map(([name, color]) => `
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: ${color};"></div>
                        <span>${name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Funções utilitárias
function getMainSubvertente(subvertentes) {
    const subvertenteList = subvertentes.split(', ').map(s => s.trim());
    
    for (let sub of subvertenteList) {
        if (SUBVERTENTE_COLORS[sub]) {
            return sub;
        }
    }
    
    return subvertenteList[0] || 'Full on';
}

function createFestivalIcon(subvertentes) {
    const mainSubvertente = getMainSubvertente(subvertentes);
    const color = SUBVERTENTE_COLORS[mainSubvertente] || '#95A5A6';
    const className = mainSubvertente.toLowerCase().replace(' ', '-') + '-marker';
    
    return L.divIcon({
        className: `custom-marker ${className}`,
        html: `<div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -6]
    });
}

function createFestivalPopup(festival) {
    const isActive = festival.status === 'Ativo';
    
    return `
        <div class="festival-popup">
            <div class="popup-header" style="background: linear-gradient(135deg, var(--primary), var(--accent));">
                <h3>${festival.nome}</h3>
                <div class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
                    ${festival.status}
                </div>
            </div>
            
            <div class="popup-content">
                <div class="festival-info">
                    <div class="info-item">
                        <div class="info-icon">📍</div>
                        <div class="info-text">
                            <strong>País:</strong> ${festival.pais}<br>
                            <strong>Continente:</strong> ${festival.continente}
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">🎵</div>
                        <div class="info-text">
                            <strong>Vertente:</strong> ${festival.vertente}<br>
                            <strong>Subgêneros:</strong> ${festival.subvertentes}
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">📅</div>
                        <div class="info-text">
                            <strong>Status:</strong> ${festival.status}<br>
                            <strong>Localização:</strong> ${festival.lat.toFixed(4)}, ${festival.lon.toFixed(4)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funções de filtro
function filterFestivals() {
    return festivalsData.filter(festival => {
        if (currentFilters.continente !== 'all' && festival.continente !== currentFilters.continente) return false;
        if (currentFilters.subvertente !== 'all' && !festival.subvertentes.includes(currentFilters.subvertente)) return false;
        if (currentFilters.status !== 'all' && festival.status !== currentFilters.status) return false;
        if (currentFilters.search && !festival.nome.toLowerCase().includes(currentFilters.search.toLowerCase())) return false;
        return true;
    });
}

function calculateStats(festivals) {
    return {
        total: festivals.length,
        active: festivals.filter(f => f.status === 'Ativo').length,
        countries: [...new Set(festivals.map(f => f.pais))].length,
        continents: [...new Set(festivals.map(f => f.continente))].length
    };
}

function applyFilters() {
    const filteredFestivals = filterFestivals();
    addMarkersToMap(filteredFestivals);
    renderStats();
}

// Funções do mapa
function addMarkersToMap(festivals) {
    if (markerCluster) {
        map.removeLayer(markerCluster);
    }
    
    allMarkers = [];
    
    festivals.forEach(festival => {
        const icon = createFestivalIcon(festival.subvertentes);
        const marker = L.marker([festival.lat, festival.lon], { icon });
        
        const popupContent = createFestivalPopup(festival);
        marker.bindPopup(popupContent, {
            maxWidth: 400,
            className: 'custom-popup'
        });

        allMarkers.push(marker);
    });

    markerCluster = L.layerGroup(allMarkers).addTo(map);
}

// Event Listeners
function setupEventListeners() {
    // Filtros
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const container = e.target.closest('.filter-options');
            if (container) {
                container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.hasAttribute('data-continent')) {
                    currentFilters.continente = e.target.getAttribute('data-continent');
                } else if (e.target.hasAttribute('data-subvertente')) {
                    currentFilters.subvertente = e.target.getAttribute('data-subvertente');
                } else if (e.target.hasAttribute('data-status')) {
                    currentFilters.status = e.target.getAttribute('data-status');
                }
                
                applyFilters();
            }
        }
    });

    // Busca
    document.getElementById('filters-container').addEventListener('input', (e) => {
        if (e.target.id === 'search-input') {
            currentFilters.search = e.target.value;
            applyFilters();
        }
    });

    // Reset
    document.getElementById('filters-container').addEventListener('click', (e) => {
        if (e.target.id === 'reset-filters') {
            currentFilters = { continente: 'all', subvertente: 'all', status: 'all', search: '' };
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.filter-options').forEach(container => {
                container.querySelector('[data-continent="all"], [data-subvertente="all"], [data-status="all"]').classList.add('active');
            });
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            applyFilters();
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Funções para pacotes (seção adicional)
function setupPackagesFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPackages(btn.dataset.filter);
        });
    });
}

function renderPackages(filter = 'all') {
    const grid = document.querySelector('.packages-grid');
    if (!grid) return;
    
    const filteredPackages = filter === 'all' 
        ? festivalPackages 
        : festivalPackages.filter(pkg => pkg.category === filter);
    
    grid.innerHTML = filteredPackages.map(pkg => `
        <div class="package-card" data-category="${pkg.category}">
            <div class="package-icon">🎪</div>
            <h4>${pkg.title}</h4>
            <div class="package-location">📍 ${pkg.location} | ⏱️ ${pkg.duration}</div>
            <p>${pkg.description}</p>
            <ul class="package-features">
                ${pkg.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="package-price">R$ ${pkg.price.toLocaleString('pt-BR')}</div>
            <button class="cta-button book-btn" onclick="bookPackage(${pkg.id})">
                Reservar Agora
            </button>
        </div>
    `).join('');
}

function bookPackage(id) {
    const pkg = festivalPackages.find(p => p.id === id);
    if (pkg) {
        alert(`Iniciando reserva para: ${pkg.title}\nValor: R$ ${pkg.price.toLocaleString('pt-BR')}`);
        // Em produção, redirecionar para checkout
    }
}

// Inicializar pacotes
if (festivalPackages && festivalPackages.length > 0) {
    renderPackages();
}
