// Dados dos Pacotes de Festivais
const festivalPackages = [
    {
        id: 1,
        title: "Rock in Rio Experience",
        category: "musica",
        location: "Rio de Janeiro, Brasil",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Pacote completo com ingressos VIP, hospedagem 5 estrelas e traslados exclusivos.",
        features: ["Ingresso 3 dias VIP", "Hotel 5 estrelas", "Traslados aeroporto", "Meet & greet com artistas", "Área premium"],
        price: 2499,
        badge: "Mais Vendido",
        duration: "4 dias"
    },
    {
        id: 2,
        title: "Oktoberfest Munich",
        category: "cultura",
        location: "Munique, Alemanha",
        image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Imersão na maior festa da cerveja do mundo com experiência cultural completa.",
        features: ["Ingressos tenda oficial", "Hospedagem central", "Tour cervejeiro", "Traje típico incluído", "Guia local"],
        price: 1899,
        badge: "Cultural",
        duration: "5 dias"
    },
    {
        id: 3,
        title: "Burning Man Adventure",
        category: "aventura",
        location: "Black Rock City, EUA",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Experiência radical no deserto com acampamento premium e suporte completo.",
        features: ["Ingresso Burning Man", "Acampamento montado", "Bicicleta personalizada", "Alimentação especial", "Suporte 24h"],
        price: 3299,
        badge: "Aventura",
        duration: "7 dias"
    },
    {
        id: 4,
        title: "Tomorrowland Full Journey",
        category: "musica",
        location: "Boom, Bélgica",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Journey completo com global journey, dreamville e experiência imersiva.",
        features: ["Global Journey", "Dreamville accomodation", "All festival tickets", "Travel insurance", "Official merchandise"],
        price: 2999,
        badge: "Esgotando",
        duration: "6 dias"
    },
    {
        id: 5,
        title: "Festival de Cannes",
        category: "cultura",
        location: "Cannes, França",
        image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Experiência cinematográfica com acesso a screenings e eventos exclusivos.",
        features: ["Acesso screenings", "Hotel riviera", "Tradução simultânea", "Cocktail reception", "City tour"],
        price: 4299,
        badge: "Premium",
        duration: "5 dias"
    },
    {
        id: 6,
        title: "Pizza Festival Napoli",
        category: "gastronomia",
        location: "Nápoles, Itália",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.auto=format&fit=crop&w=800&q=80",
        description: "Tour gastronômico pela capital da pizza com workshops e degustações.",
        features: ["Workshops pizza", "Degustações premium", "Hospedagem histórica", "Tour vinícola", "Certificado"],
        price: 1599,
        badge: "Gastronômico",
        duration: "4 dias"
    }
];

// Função para renderizar os pacotes
function renderPackages(filter = 'all') {
    const grid = document.querySelector('.packages-grid');
    const filteredPackages = filter === 'all' 
        ? festivalPackages 
        : festivalPackages.filter(pkg => pkg.category === filter);
    
    grid.innerHTML = filteredPackages.map(pkg => `
        <div class="package-card" data-category="${pkg.category}">
            ${pkg.badge ? `<span class="package-badge">${pkg.badge}</span>` : ''}
            <img src="${pkg.image}" alt="${pkg.title}" class="package-image">
            <div class="package-content">
                <h3 class="package-title">${pkg.title}</h3>
                <div class="package-location">
                    📍 ${pkg.location} | ⏱️ ${pkg.duration}
                </div>
                <p class="package-description">${pkg.description}</p>
                <ul class="package-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="package-price">
                    R$ ${pkg.price.toLocaleString('pt-BR')}
                    <span>por pessoa</span>
                </div>
                <button class="book-btn" onclick="bookPackage(${pkg.id})">
                    Reservar Agora
                </button>
            </div>
        </div>
    `).join('');
}

// Função de filtro
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona ao clicado
            btn.classList.add('active');
            // Renderiza com filtro
            const filter = btn.dataset.filter;
            renderPackages(filter);
        });
    });
}

// Função para reserva
function bookPackage(id) {
    const package = festivalPackages.find(p => p.id === id);
    if (package) {
        // Aqui você pode integrar com um sistema de reservas
        alert(`Ótima escolha! Iniciando reserva para: ${package.title}\n\nValor: R$ ${package.price.toLocaleString('pt-BR')}`);
        // Em um sistema real, redirecionaria para checkout
        // window.location.href = `/checkout?package=${id}`;
    }
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    renderPackages();
    setupFilters();
    
    // Adiciona integração com mapa (se houver)
    integrateWithMap();
});

// Integração com mapa existente (se aplicável)
function integrateWithMap() {
    // Esta função pode adicionar marcadores no mapa para os festivais
    console.log('Integrando pacotes com mapa...');
    // Se você usa Leaflet ou outra biblioteca de mapas,
    // adicione os marcadores aqui baseado nos pacotes
          }
