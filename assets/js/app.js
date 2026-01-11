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
        
        // DADOS COMPLETOS - INCLUINDO FESTIVAIS COM ÍCONES PERSONALIZADOS
        const sampleFestivals = [
            // 🌍 EUROPA
            { name: 'Boom Festival', location: 'Portugal', date: 'Jul 2024', type: 'Full On' },
            { name: 'Ozora Festival', location: 'Hungria', date: 'Ago 2024', type: 'Progressive' },
            { name: 'Modem Festival', location: 'Croácia', date: 'Jul 2024', type: 'Darkpsy' },
            { name: 'Antaris Project', location: 'Alemanha', date: 'Ago 2024', type: 'Full On' },
            { name: 'Shankra Festival', location: 'Suíça', date: 'Jul 2024', type: 'Psy Progressive' },
            { name: 'Spirit of Nature', location: 'Grécia', date: 'Jun 2024', type: 'Forest' },
            { name: 'Vuu Festival', location: 'Espanha', date: 'Set 2024', type: 'Progressive' },
            { name: 'Forest Soul Gathering', location: 'Portugal', date: 'Mai 2024', type: 'Forest' },
            { name: 'Trance Odissey', location: 'Portugal', date: 'Jun 2024', type: 'Full On' },
            { name: 'Free Earth Festival', location: 'Grécia', date: 'Jul 2024', type: 'Full On' },
            { name: 'Midnight Sun Festival', location: 'Noruega', date: 'Jun 2024', type: 'Full On' },
            { name: 'Ethereal Decibel Festival', location: 'França', date: 'Ago 2024', type: 'Full On' },
            { name: 'Invoke Festival', location: 'Inglaterra', date: 'Set 2024', type: 'Darkpsy' },
            { name: 'Pyramid Festival', location: 'Sérvia', date: 'Jul 2024', type: 'Darkpsy' },
            { name: 'Tree of Life Festival', location: 'Turquia', date: 'Ago 2024', type: 'Full On' },
            { name: 'Master of Puppets', location: 'República Tcheca', date: 'Out 2024', type: 'Hitech' },
            { name: 'Hadra', location: 'França', date: 'Ago 2024', type: 'Progressive' },

            // 🌎 AMÉRICA DO SUL - COM ÍCONES PERSONALIZADOS
            { name: 'Universo Paralello', location: 'Brasil', date: 'Dez 2024', type: 'Forest' },
            { name: 'Mundo de Oz', location: 'Brasil', date: 'Set 2024', type: 'Full On' },
            { name: 'Adhana', location: 'Brasil', date: 'Out 2024', type: 'Darkpsy' },
            { name: 'Amazonas Andes', location: 'Peru', date: 'Jul 2024', type: 'Forest' },
            
            { name: 'Origin Festival', location: 'Brasil', date: 'Set 2024', type: 'Darkpsy' },
            { name: 'High Stage', location: 'Brasil', date: 'Vários Datas', type: 'Hitech' },
            { name: 'Hitech Revolution', location: 'Brasil', date: 'Vários Datas', type: 'Hitech' },
            { name: 'Swampy Festival', location: 'Brasil', date: 'Vários Datas', type: 'Full On' },
            { name: 'Pulsar Festival', location: 'Brasil', date: 'Nov 2024', type: 'Darkpsy' },
            { name: 'Psychedelic Experience', location: 'Argentina', date: 'Nov 2024', type: 'Full On' },
            { name: 'Psychedelic Resistance', location: 'Argentina', date: 'Out 2024', type: 'Full On' },

            // 🌏 AMÉRICA DO NORTE
            { name: 'Grooven Bass Festival', location: 'Canadá', date: 'Jul 2024', type: 'Full On' },
            { name: 'Limitless Festival', location: 'Canadá', date: 'Ago 2024', type: 'Full On' },
            { name: 'Mind Levitation', location: 'Canadá', date: 'Set 2024', type: 'Full On' },
            { name: 'Ananta Gathering', location: 'Canadá', date: 'Jun 2024', type: 'Full On' },

            // 🌎 AMÉRICA CENTRAL
            { name: 'Tribe Gathering', location: 'Panamá', date: 'Jan 2025', type: 'Full On' },
            { name: 'Ometeotl Festival', location: 'México', date: 'Mar 2024', type: 'Progressive' },
            { name: 'Equinox Festival', location: 'México', date: 'Set 2024', type: 'Full On' },
            { name: 'Atmosphere Festival', location: 'México', date: 'Nov 2024', type: 'Full On' },

            // 🌏 ÁSIA
            { name: 'Goa Festival', location: 'Índia', date: 'Dez 2024', type: 'Full On' },
            { name: 'Kali Mela', location: 'Índia', date: 'Fev 2025', type: 'Darkpsy' },
            { name: 'Hill Top Goa', location: 'Índia', date: 'Jan 2025', type: 'Full On' },
            { name: 'Shuangda Festival', location: 'China', date: 'Abr 2024', type: 'Full On' },
            { name: 'Ligoor Spirit Festival', location: 'China', date: 'Mai 2024', type: 'Full On' },
            { name: 'Sacred Aeon Festival', location: 'Camboja', date: 'Dez 2024', type: 'Full On' },

            // 🌏 OCEANIA
            { name: 'Universal Frequencies', location: 'Austrália', date: 'Mar 2024', type: 'Full On' },
            { name: 'Lost in Paradise', location: 'Nova Zelândia', date: 'Fev 2025', type: 'Full On' }
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
            
            // Verificar se tem ícone personalizado
            const festivalIcons = {
                'Universo Paralello': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/universoparalello_icone.png',
                'Mundo de Oz': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/mundodeoz_icone.png',
                'Hadra': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/hadra_icone.png',
                'Adhana': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/adhana_icone.png',
                'Amazonas Andes': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/amazonasandes_icone.png'
            };
            
            const hasCustomIcon = festivalIcons[festival.name];
            
            festivalElement.innerHTML = `
                <div class="festival-name">${festival.name} ${hasCustomIcon ? '🎨' : ''}</div>
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
                highlightFestivalOnMap(index);
            });
            
            festivalsList.appendChild(festivalElement);
        });
        
        festivals = sampleFestivals;
        
        // Adicionar todos os marcadores no mapa
        addAllFestivalsToMap(sampleFestivals);
        
        console.log(`✅ ${sampleFestivals.length} festivais carregados na lista!`);
        
    }, 1000);
}

// Adicionar todos os festivais ao mapa
function addAllFestivalsToMap(festivalsData) {
    console.log('🗺️ Adicionando todos os festivais ao mapa...');
    
    // COORDENADAS COMPLETAS - INCLUINDO NOVOS FESTIVAIS
    const festivalCoordinates = {
        // 🌍 EUROPA
        'Boom Festival': [39.5999, -8.6851],
        'Ozora Festival': [46.8444, 17.8914],
        'Modem Festival': [45.4929, 15.5556],
        'Antaris Project': [52.5200, 13.4050],
        'Shankra Festival': [46.8182, 8.2275],
        'Spirit of Nature': [37.9838, 23.7275],
        'Vuu Festival': [40.4168, -3.7038],
        'Forest Soul Gathering': [41.732198, -7.831288],
        'Trance Odissey': [39.249052, -8.811818],
        'Free Earth Festival': [40.720365, 23.709953],
        'Midnight Sun Festival': [58.337636, 7.196158],
        'Ethereal Decibel Festival': [48.536211, -0.999927],
        'Invoke Festival': [53.167294, -0.249981],
        'Pyramid Festival': [43.557516, 21.940234],
        'Tree of Life Festival': [38.557962, 27.217006],
        'Master of Puppets': [49.54324, 16.29442],
        'Hadra': [45.7640, 4.8357], // Lyon, França

        // 🌎 AMÉRICA DO SUL - COM ÍCONES PERSONALIZADOS
        'Universo Paralello': [-12.9714, -38.5014],
        'Mundo de Oz': [-23.5505, -46.6333], // São Paulo, Brasil
        'Adhana': [-15.7975, -47.8919], // Brasília, Brasil
        'Amazonas Andes': [-12.0464, -77.0428], // Lima, Peru
        
        'Origin Festival': [-15.7975, -47.8919],
        'High Stage': [-23.08043, -45.20952],
        'Hitech Revolution': [-23.078685, -45.178715],
        'Swampy Festival': [-21.060319, -44.845167],
        'Pulsar Festival': [-19.612239, -43.427707],
        'Psychedelic Experience': [-34.6037, -58.3816],
        'Psychedelic Resistance': [-34.792092, -59.05887],

        // 🌏 AMÉRICA DO NORTE
        'Grooven Bass Festival': [48.375358, -74.014819],
        'Limitless Festival': [47.013977, -72.370865],
        'Mind Levitation': [45.07101, -79.38973],
        'Ananta Gathering': [51.953908, -85.192186],

        // 🌎 AMÉRICA CENTRAL
        'Tribe Gathering': [9.100921, -80.392383],
        'Ometeotl Festival': [19.4326, -99.1332],
        'Equinox Festival': [19.23673, -96.269526],
        'Atmosphere Festival': [18.916937, -98.994863],

        // 🌏 ÁSIA
        'Goa Festival': [15.2993, 74.1240],
        'Kali Mela': [32.063376, 76.983855],
        'Hill Top Goa': [15.415892, 73.635303],
        'Shuangda Festival': [30.033724, 121.508543],
        'Ligoor Spirit Festival': [30.849691, 104.063824],
        'Sacred Aeon Festival': [11.122385, 102.947911],

        // 🌏 OCEANIA
        'Universal Frequencies': [-31.979072, 121.995408],
        'Lost in Paradise': [-35.725995, 174.320699]
    };
    
    const colors = {
        'Full On': '#EF4444',
        'Progressive': '#10B981', 
        'Darkpsy': '#8B5CF6',
        'Forest': '#22C55E',
        'Hitech': '#06B6D4',
        'Psy Progressive': '#F59E0B',
        'Core': '#DC2626',
        'Night': '#7C3AED'
    };
    
    // Limpar marcadores existentes
    currentMarkers.forEach(marker => {
        if (map && marker) {
            map.removeLayer(marker);
        }
    });
    currentMarkers = [];
    
    // Adicionar marcadores para todos os festivais
    festivalsData.forEach((festival, index) => {
        const coords = festivalCoordinates[festival.name] || [20 + Math.random() * 40, -100 + Math.random() * 200];
        const color = colors[festival.type] || '#94a3b8';
        
        addSingleFestivalMarker(festival, coords, color, index);
    });
    
    console.log(`✅ ${festivalsData.length} festivais adicionados ao mapa!`);
}

// Adicionar um único marcador de festival COM ÍCONES PERSONALIZADOS
function addSingleFestivalMarker(festival, coords, color, index) {
    try {
        // Mapeamento de festivais para ícones personalizados
        const festivalIcons = {
            'Universo Paralello': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/universoparalello_icone.png',
            'Mundo de Oz': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/mundodeoz_icone.png',
            'Hadra': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/hadra_icone.png',
            'Adhana': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/adhana_icone.png',
            'Amazonas Andes': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/amazonasandes_icone.png'
        };

        // Verificar se tem ícone personalizado para este festival
        const customIconUrl = festivalIcons[festival.name];
        
        let marker;
        
        if (customIconUrl) {
            // Usar ícone personalizado
            const customIcon = L.icon({
                iconUrl: customIconUrl,
                iconSize: [32, 32],    // Tamanho do ícone
                iconAnchor: [16, 16],  // Ponto de ancoragem (centro)
                popupAnchor: [0, -16]  // Onde o popup aparece em relação ao ícone
            });
            
            marker = L.marker(coords, { icon: customIcon });
            console.log(`🎨 Usando ícone personalizado para: ${festival.name}`);
        } else {
            // Usar ícone padrão colorido
            const defaultIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            marker = L.marker(coords, { icon: defaultIcon });
        }
        
        // Adicionar marcador ao mapa
        marker.addTo(map)
            .bindPopup(`
                <div class="popup-content" style="min-width: 220px;">
                    <h4 style="color: ${color}; margin: 0 0 8px 0; font-size: 1.1rem;">${festival.name}</h4>
                    <p style="margin: 4px 0; font-size: 0.9rem;"><strong>📍 Local:</strong> ${festival.location}</p>
                    <p style="margin: 4px 0; font-size: 0.9rem;"><strong>📅 Data:</strong> ${festival.date}</p>
                    <p style="margin: 4px 0; font-size: 0.9rem;"><strong>🎵 Estilo:</strong> <span style="color: ${color}; font-weight: 600;">${festival.type}</span></p>
                    ${customIconUrl ? `<img src="${customIconUrl}" style="width: 50px; height: 50px; border-radius: 8px; margin-top: 8px; display: block; margin-left: auto; margin-right: auto;">` : ''}
                    <div style="margin-top: 8px; padding: 6px; background: #f8f9fa; border-radius: 4px; font-size: 0.8rem;">
                        <small>✨ Clique no mapa para fechar</small>
                    </div>
                </div>
            `);
        
        // Salvar referência do marcador
        currentMarkers.push(marker);
        
    } catch (error) {
        console.error(`❌ Erro ao adicionar marcador ${festival.name}:`, error);
        
        // Fallback: usar marcador padrão do Leaflet
        const marker = L.marker(coords)
            .addTo(map)
            .bindPopup(`<b>${festival.name}</b><br>${festival.location}<br>🎵 ${festival.type}`);
        
        currentMarkers.push(marker);
    }
}

// Destacar festival no mapa
function highlightFestivalOnMap(index) {
    if (currentMarkers[index] && map) {
        try {
            // Abrir popup do marcador
            currentMarkers[index].openPopup();
            
            // Voar para o marcador
            const coords = currentMarkers[index].getLatLng();
            map.flyTo(coords, 8, {
                duration: 1.5
            });
            
            console.log('🎯 Navegando para:', festivals[index].name);
        } catch (error) {
            console.error('❌ Erro ao destacar festival:', error);
        }
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
    
    // PAÍSES COMPLETOS - TODOS OS 40+ FESTIVAIS
    const countries = [
        'Todos os Países',
        // Europa
        'Portugal', 'Hungria', 'Croácia', 'Alemanha', 'Suíça', 'Grécia', 'Espanha',
        'Noruega', 'França', 'Inglaterra', 'Sérvia', 'Turquia', 'República Tcheca',
        // América
        'Brasil', 'Argentina', 'Canadá', 'Panamá', 'México',
        // Ásia
        'Índia', 'China', 'Camboja',
        // Oceania
        'Austrália', 'Nova Zelândia'
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
        
        // Implementar filtro
        filterFestivalsByCountry(selectedCountry);
    });
    
    console.log(`✅ ${countries.length} países adicionados ao filtro!`);
}

// Filtrar festivais por país
function filterFestivalsByCountry(country) {
    if (!country) {
        // Mostrar todos os marcadores
        currentMarkers.forEach(marker => {
            if (map && marker) {
                map.addLayer(marker);
            }
        });
        console.log('🌍 Mostrando todos os festivais');
    } else {
        // Esconder marcadores que não pertencem ao país
        currentMarkers.forEach((marker, index) => {
            if (map && marker) {
                const festival = festivals[index];
                if (festival && festival.location.toLowerCase().includes(country)) {
                    map.addLayer(marker);
                } else {
                    map.removeLayer(marker);
                }
            }
        });
        console.log(`🌍 Filtrado para: ${country}`);
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
