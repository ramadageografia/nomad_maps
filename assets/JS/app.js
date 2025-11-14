// NOMAD MAPS - Main Application
console.log('🚀 NOMAD MAPS - Inicializando aplicação...');

// Variáveis globais
let map;
let festivals = [];
let currentMarkers = [];

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Carregado - Iniciando configurações...');
    
    // 1. Inicializar mapa PRIMEIRO
    initializeMap();
    
    // 2. Carregar festivais
    loadFestivals();
    
    // 3. Configurar filtros
    setupFilters();
    
    console.log('🎯 Aplicação inicializada com sucesso!');
});

// Função para inicializar o mapa
function initializeMap() {
    console.log('🗺️ Inicializando mapa...');
    
    try {
        // Coordenadas iniciais (centro do mundo)
        const initialCoords = [20, 0];
        const initialZoom = 2;
        
        // Criar mapa
        map = L.map('map', {
            center: initialCoords,
            zoom: initialZoom,
            zoomControl: true,
            attributionControl: true
        });
        
        // Adicionar tile layer (mapa base)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(map);
        
        // Adicionar controle de escala
        L.control.scale().addTo(map);
        
        // Adicionar alguns marcadores de exemplo
        addSampleMarkers();
        
        // Salvar referência global
        window.nomadMap = map;
        
        console.log('✅ Mapa inicializado com sucesso!');
        console.log('📍 Centro:', initialCoords);
        console.log('🔍 Zoom:', initialZoom);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar mapa:', error);
        showMapError();
    }
}

// Adicionar marcadores de exemplo
function addSampleMarkers() {
    console.log('📍 Adicionando marcadores de exemplo...');
    
    const sampleFestivals = [
        { 
            name: 'Boom Festival', 
            coords: [39.5999, -8.6851], 
            type: 'fullon',
            location: 'Idanha-a-Nova, Portugal',
            date: 'Jul 2024'
        },
        { 
            name: 'Ozora Festival', 
            coords: [46.8444, 17.8914], 
            type: 'progressive',
            location: 'Dádpuszta, Hungria',
            date: 'Ago 2024'
        },
        { 
            name: 'Modem Festival', 
            coords: [45.4929, 15.5556], 
            type: 'darkpsy',
            location: 'Sljeme, Croácia',
            date: 'Jul 2024'
        },
        { 
            name: 'Universo Paralello', 
            coords: [-12.9714, -38.5014], 
            type: 'forest',
            location: 'Bahia, Brasil',
            date: 'Dez 2024'
        },
        { 
            name: 'Master of Puppets', 
            coords: [-23.5505, -46.6333], 
            type: 'hitech',
            location: 'São Paulo, Brasil',
            date: 'Out 2024'
        }
    ];
    
    // Cores para cada tipo de psytrance
    const colors = {
        fullon: '#EF4444',
        darkpsy: '#8B5CF6', 
        hitech: '#06B6D4',
        progressive: '#10B981',
        forest: '#22C55E'
    };
    
    // Ícones personalizados
    const createCustomIcon = (color) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });
    };
    
    // Adicionar cada marcador
    sampleFestivals.forEach(festival => {
        const customIcon = createCustomIcon(colors[festival.type]);
        
        const marker = L.marker(festival.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <div class="popup-content" style="min-width: 200px;">
                    <h4 style="color: ${colors[festival.type]}; margin: 0 0 8px 0;">${festival.name}</h4>
                    <p style="margin: 4px 0;"><strong>📍 Local:</strong> ${festival.location}</p>
                    <p style="margin: 4px 0;"><strong>📅 Data:</strong> ${festival.date}</p>
                    <p style="margin: 4px 0;"><strong>🎵 Estilo:</strong> <span style="color: ${colors[festival.type]}">${festival.type}</span></p>
                    <div style="margin-top: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <small>✨ Clique no mapa para fechar</small>
                    </div>
                </div>
            `);
        
        // Adicionar à lista de marcadores
        currentMarkers.push(marker);
        
        // Evento de clique no marcador
        marker.on('click', function() {
            console.log('🎵 Marcador clicado:', festival.name);
        });
    });
    
    console.log(`✅ ${sampleFestivals.length} marcadores adicionados!`);
}

// Carregar lista de festivais na sidebar
function loadFestivals() {
    console.log('🎵 Carregando lista de festivais...');
    
    // Simular carregamento assíncrono
    setTimeout(() => {
        const festivalsList = document.getElementById('festivalsList');
        const festivalCount = document.getElementById('festivalCount');
        
        if (!festivalsList || !festivalCount) {
            console.error('❌ Elementos da lista não encontrados!');
            return;
        }
        
        // Dados de exemplo
        const sampleFestivals = [
            { name: 'Boom Festival', location: 'Portugal', date: 'Jul 2024', type: 'Full On' },
            { name: 'Ozora Festival', location: 'Hungria', date: 'Ago 2024', type: 'Progressive' },
            { name: 'Modem Festival', location: 'Croácia', date: 'Jul 2024', type: 'Darkpsy' },
            { name: 'Universo Paralello', location: 'Brasil', date: 'Dez 2024', type: 'Forest' },
            { name: 'Master of Puppets', location: 'Brasil', date: 'Out 2024', type: 'Hitech' }
        ];
        
        // Atualizar contador
        festivalCount.textContent = `${sampleFestivals.length} encontrados`;
        festivalCount.style.color = '#10b981';
        festivalCount.style.fontWeight = '600';
        
        // Limpar loading
        festivalsList.innerHTML = '';
        
        // Adicionar festivais à lista
        sampleFestivals.forEach((festival, index) => {
            const festivalElement = document.createElement('div');
            festivalElement.className = 'festival-item';
            festivalElement.innerHTML = `
                <div class="festival-name">${festival.name}</div>
                <div class="festival-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${festival.location} • ${festival.date}
                </div>
                <div class="festival-type" style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">
                    🎵 ${festival.type}
                </div>
            `;
            
            // Adicionar evento de clique
            festivalElement.addEventListener('click', function() {
                console.log('🎵 Festival clicado:', festival.name);
                // Aqui você pode implementar a navegação no mapa
                highlightFestivalOnMap(index);
            });
            
            festivalsList.appendChild(festivalElement);
        });
        
        festivals = sampleFestivals;
        console.log(`✅ ${sampleFestivals.length} festivais carregados na lista!`);
        
    }, 1500); // Simular delay de carregamento
}

// Destacar festival no mapa
function highlightFestivalOnMap(index) {
    if (currentMarkers[index]) {
        // Abrir popup do marcador
        currentMarkers[index].openPopup();
        
        // Voar para o marcador
        const coords = currentMarkers[index].getLatLng();
        map.flyTo(coords, 8, {
            duration: 1.5
        });
        
        console.log('🎯 Navegando para:', festivals[index].name);
    }
}

// Configurar filtros
function setupFilters() {
    const countryFilter = document.getElementById('countryFilter');
    
    if (!countryFilter) {
        console.error('❌ Filtro de país não encontrado!');
        return;
    }
    
    console.log('⚙️ Configurando filtros...');
    
    // Países de exemplo
    const countries = [
        'Todos os Países',
        'Brasil', 
        'Portugal', 
        'Espanha', 
        'Alemanha', 
        'Hungria', 
        'Croácia',
        'Índia',
        'Tailândia',
        'México'
    ];
    
    // Limpar options existentes
    countryFilter.innerHTML = '';
    
    // Adicionar países
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country === 'Todos os Países' ? '' : country.toLowerCase();
        option.textContent = country;
        countryFilter.appendChild(option);
    });
    
    // Event listener para filtro
    countryFilter.addEventListener('change', function() {
        const selectedCountry = this.value;
        console.log('🌍 Filtrando por país:', selectedCountry || 'Todos');
        
        // Aqui você implementaria o filtro real
        filterFestivalsByCountry(selectedCountry);
    });
    
    console.log(`✅ ${countries.length} países adicionados ao filtro!`);
}

// Filtrar festivais por país
function filterFestivalsByCountry(country) {
    // Implementação básica do filtro
    if (!country) {
        // Mostrar todos os marcadores
        currentMarkers.forEach(marker => {
            marker.addTo(map);
        });
    } else {
        // Aqui você implementaria a lógica de filtro real
        console.log('🔍 Aplicando filtro para:', country);
        // Por enquanto, apenas log
    }
}

// Mostrar erro se o mapa falhar
function showMapError() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ef4444; text-align: center; padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🗺️❌</div>
                <h3>Erro ao carregar o mapa</h3>
                <p>O mapa não pôde ser carregado. Verifique o console para detalhes.</p>
                <button onclick="initializeMap()" style="margin-top: 15px; padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
}

// Função utilitária para verificar se elementos existem
function checkRequiredElements() {
    const required = ['map', 'festivalsList', 'festivalCount', 'countryFilter'];
    const missing = required.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
        console.error('❌ Elementos faltando:', missing);
        return false;
    }
    
    console.log('✅ Todos os elementos necessários encontrados!');
    return true;
}
