// Variáveis globais
let map;
let allMarkers = [];

// Mapeamento de ícones personalizados
const customIcons = {
    'Boom Festival': 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/icones/boom-removebg-preview%20(1).png',
    'Ozora Festival': '🎵', // Placeholder - você pode adicionar a URL real depois
    'Universo Paralello': '🎵', // Placeholder
    // Adicione outros festivais conforme tiver os ícones
};

// Aguardar o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 NOMAD MAPS - Iniciando mapa...');
    
    // Inicializar Mapa
    map = L.map('map').setView([10, 0], 2);

    // Adicionar Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Carregar todos os festivais
    loadAllFestivals();
    
    // Configurar filtros
    setupFilters();
    
    // Atualizar contador
    updateFestivalCount();

    console.log('✅ NOMAD MAPS - Mapa carregado com sucesso!');
});

// Carregar todos os festivais
function loadAllFestivals() {
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
        marker.addTo(map);
    });
    
    updateSidebarList();
}

// Criar ícone do festival - AGORA COM ÍCONES PERSONALIZADOS
function createFestivalIcon(festival) {
    // Verificar se tem ícone personalizado
    if (customIcons[festival.name] && !customIcons[festival.name].includes('🎵')) {
        return L.icon({
            iconUrl: customIcons[festival.name],
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
            className: 'custom-festival-icon'
        });
    }
    
    // Se não tem ícone personalizado, usar ícone colorido padrão
    const colorMap = {
        'Full on': '#EF4444',
        'Darkpsy': '#8B5CF6', 
        'Hitech': '#06B6D4',
        'Prog': '#10B981',
        'Forest': '#22C55E',
        'Night': '#6366F1',
        'Goa': '#F59E0B',
        'Core': '#DC2626'
    };
    
    let color = '#3B82F6';
    let iconChar = customIcons[festival.name] || '🎵'; // Usar emoji do mapeamento ou padrão
    
    // Encontrar cor baseada nas subvertentes
    for (const [key, value] of Object.entries(colorMap)) {
        if (festival.subgenres.includes(key)) {
            color = value;
            if (key === 'Forest') iconChar = '🌲';
            else if (key === 'Night') iconChar = '🌙';
            else if (key === 'Goa') iconChar = '☮️';
            else if (key === 'Darkpsy') iconChar = '👁️';
            else if (key === 'Hitech') iconChar = '⚡';
            break;
        }
    }
    
    return L.divIcon({
        className: 'festival-marker',
        html: `
            <div style="
                background: ${color};
                width: 32px;
                height: 32px;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                color: white;
                font-weight: bold;
            ">
                ${iconChar}
            </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
    });
}

// Criar popup
function createFestivalPopup(festival) {
    const mainSubgenre = festival.subgenres.split(', ')[0];
    
    // Adicionar imagem do flyer se existir
    const flyerUrl = `https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/assets/Imagens/flyers/${festival.name.replace(/\s+/g, '_')}.jpg`;
    
    return `
        <div class="festival-popup">
            <div class="festival-name">${festival.name}</div>
            <img src="${flyerUrl}" alt="${festival.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" onerror="this.style.display='none'">
            <div class="festival-info">
                <strong>Localização:</strong> ${festival.country}, ${festival.continent}<br>
                <strong>Gênero:</strong> ${festival.main_genre}<br>
                <strong>Subvertentes:</strong> ${festival.subgenres}<br>
                <strong>Status:</strong> 
                <span class="festival-status ${festival.status === 'Ativo' ? 'ativo' : 'inativo'}">
                    ${festival.status}
                </span>
            </div>
        </div>
    `;
}

// Atualizar sidebar
function updateSidebarList() {
    const listContainer = document.getElementById('festivalsList');
    
    const festivalList = festivalsData.map(festival => {
        const mainSubgenre = festival.subgenres.split(', ')[0];
        
        return `
            <div class="festival-card" onclick="zoomToFestival('${festival.name}')" data-festival="${festival.name}">
                <div class="festival-name">${festival.name}</div>
                <div class="festival-location">${festival.country} • ${festival.continent}</div>
                <div class="festival-meta">
                    <span class="festival-genre">${mainSubgenre}</span>
                    <span class="festival-status ${festival.status === 'Ativo' ? 'ativo' : 'inativo'}">${festival.status}</span>
                </div>
            </div>
        `;
    }).join('');
    
    listContainer.innerHTML = festivalList;
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
        
        const marker = allMarkers.find(m => m.options.festival.name === festivalName);
        if (marker) {
            marker.openPopup();
        }
    }
}

// Configurar filtros
function setupFilters() {
    const countries = [...new Set(festivalsData.map(f => f.country))].sort();
    const countrySelect = document.getElementById('countryFilter');
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    
    countrySelect.addEventListener('change', filterFestivals);
}

// Filtrar festivais
function filterFestivals() {
    const country = document.getElementById('countryFilter').value;
    
    // Mostrar/ocultar marcadores
    allMarkers.forEach(marker => {
        const festival = marker.options.festival;
        if (!country || festival.country === country) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
    
    // Filtrar lista sidebar
    const festivalCards = document.querySelectorAll('.festival-card');
    festivalCards.forEach(card => {
        const festivalName = card.dataset.festival;
        const festival = festivalsData.find(f => f.name === festivalName);
        
        if (!country || festival.country === country) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateFestivalCount();
}

// Atualizar contador
function updateFestivalCount() {
    const country = document.getElementById('countryFilter').value;
    let count = festivalsData.length;
    
    if (country) {
        count = festivalsData.filter(f => f.country === country).length;
    }
    
    document.getElementById('festivalCount').textContent = `${count} festivais`;
}
