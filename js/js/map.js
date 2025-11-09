javascript
// Configuração do mapa
const map = L.map('map', {
    zoomControl: true
}).setView([20, 0], 2);

// Camada de mapa escuro
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Ícones no estilo Nomad
function createNomadIcon(genre, status) {
    const colors = {
        'Psytrance - multigênero': '#00ffc8', // Ciano
        'Darkpsy': '#ff00ff', // Magenta
        'Hitech Psytrance': '#ff5500' // Laranja
    };
    
    const color = colors[genre] || '#cccccc';
    const opacity = status === 'Ativo' ? 1 : 0.4;
    const size = status === 'Ativo' ? 12 : 8;
    
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 2px solid #121212;
                border-radius: 50%;
                box-shadow: 0 0 10px ${color};
                opacity: ${opacity};
            "></div>
        `,
        iconSize: [size + 4, size + 4],
        iconAnchor: [(size + 4) / 2, (size + 4) / 2]
    });
}

// Variáveis globais
let festivals = [];
let markers = [];
let currentPopup = null;

// Carregar dados
fetch('dados/processed/festivals.json')
    .then(response => response.json())
    .then(data => {
        festivals = data.festivals;
        initMap();
        updateFestivalList(festivals);
        updateFeaturedFestivals();
    })
    .catch(error => console.error('Erro ao carregar dados:', error));

function initMap() {
    // Limpar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Adicionar marcadores
    festivals.forEach(festival => {
        const marker = L.marker([festival.lat, festival.lng], {
            icon: createNomadIcon(festival.vertente, festival.status)
        }).addTo(map);

        // Popup no estilo Nomad
        const popupContent = `
            <div class="popup-content">
                <h3 class="neon-text">${festival.nome}</h3>
                <p><strong>País:</strong> ${festival.pais}</p>
                <p><strong>Continente:</strong> ${festival.continente}</p>
                <p><strong>Vertente:</strong> ${festival.vertente}</p>
                <p><strong>Subgêneros:</strong> ${festival.subvertentes}</p>
                <p><strong>Status:</strong> <span class="status-${festival.status.toLowerCase()}">${festival.status}</span></p>
            </div>
        `;

        marker.bindPopup(popupContent);
        
        // Eventos
        marker.on('click', function() {
            if (currentPopup) {
                currentPopup.closePopup();
            }
            currentPopup = this;
            highlightFestivalItem(festival.id);
        });

        marker.festivalData = festival;
        markers.push(marker);
    });
}

function updateFestivalList(filteredFestivals) {
    const listContainer = document.getElementById('festivalList');
    const countElement = document.getElementById('festivalCount');
    
    countElement.textContent = filteredFestivals.length;
    
    listContainer.innerHTML = filteredFestivals.map(festival => `
        <div class="festival-item" data-id="${festival.id}" onclick="focusOnFestival(${festival.id})">
            <div class="festival-name">${festival.nome}</div>
            <div class="festival-location">
                ${festival.pais} - ${festival.continente}
            </div>
            <div class="festival-genre">${festival.vertente}</div>
            <span class="festival-status status-${festival.status.toLowerCase()}">${festival.status}</span>
        </div>
    `).join('');
}

function updateFeaturedFestivals() {
    const featuredContainer = document.getElementById('featuredFestivals');
    
    // Selecionar alguns festivais ativos para destaque
    const featured = festivals
        .filter(f => f.status === 'Ativo')
        .slice(0, 6); // Mostrar 6 festivais em destaque
    
    featuredContainer.innerHTML = featured.map(festival => `
        <div class="featured-festival-card">
            <img src="https://via.placeholder.com/400x200/1f1f1f/00ffc8?text=${encodeURIComponent(festival.nome)}" alt="${festival.nome}">
            <div class="featured-festival-info">
                <h3 class="neon-text">${festival.nome}</h3>
                <p>${festival.pais} | ${festival.continente}</p>
                <p><strong>${festival.vertente}</strong></p>
                <p>${festival.subvertentes}</p>
                <a href="#" class="cta-button" style="width: 100%; margin-top: 15px; font-size: 0.9em;">VER NO MAPA</a>
            </div>
        </div>
    `).join('');
}

function focusOnFestival(festivalId) {
    const festival = festivals.find(f => f.id === festivalId);
    if (festival) {
        map.setView([festival.lat, festival.lng], 8);
        
        const marker = markers.find(m => m.festivalData.id === festivalId);
        if (marker) {
            marker.openPopup();
            highlightFestivalItem(festivalId);
        }
    }
}

function highlightFestivalItem(festivalId) {
    document.querySelectorAll('.festival-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === festivalId) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Filtros
document.getElementById('continentFilter').addEventListener('change', applyFilters);
document.getElementById('genreFilter').addEventListener('change', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('searchInput').addEventListener('input', applyFilters);

function applyFilters() {
    const continent = document.getElementById('continentFilter').value;
    const genre = document.getElementById('genreFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    let filtered = festivals;

    if (continent) {
        filtered = filtered.filter(f => f.continente === continent);
    }

    if (genre) {
        filtered = filtered.filter(f => f.vertente === genre);
    }

    if (status) {
        filtered = filtered.filter(f => f.status === status);
    }

    if (search) {
        filtered = filtered.filter(f => 
            f.nome.toLowerCase().includes(search) ||
            f.pais.toLowerCase().includes(search) ||
            f.continente.toLowerCase().includes(search)
        );
    }

    // Atualizar mapa
    markers.forEach(marker => {
        const festival = marker.festivalData;
        const shouldShow = filtered.some(f => f.id === festival.id);
        
        if (shouldShow) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });

    updateFestivalList(filtered);
}

// Smooth scroll para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
