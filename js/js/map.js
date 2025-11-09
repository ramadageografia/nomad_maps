// Inicialização do mapa
const map = L.map('map', {
  worldCopyJump: true
}).setView([10, 0], 2);

// Camada base escura cósmica
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Ícone customizado (ex: Hadra)
const hadraIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/imagens/imagens/hadra_icone.png',
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28]
});

// Função para gerar ícones coloridos
function getCustomIcon(color) {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Cores por vertente
const iconColors = {
  "Full On": "blue",
  "Progressive": "green",
  "Forest": "orange",
  "Darkpsy": "black",
  "Hitech": "red",
  "Outro": "violet"
};

// Carregar dados de festivais
fetch('https://raw.githubusercontent.com/ramadageografia/nomad_maps/main/festivals.json')
  .then(response => response.json())
  .then(festivals => {
    festivals.forEach(f => {
      // Ícone específico para Hadra
      const icon = f.nome === "Hadra Trance Festival" ? hadraIcon : getCustomIcon(iconColors[f.vertente] || "violet");

      const marker = L.marker([f.latitude, f.longitude], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="text-align:center;">
          <h3 style="color:#ff4f9a; margin:5px 0;">${f.nome}</h3>
          <b>${f.pais}</b> — ${f.continente}<br>
          <i>${f.vertente}</i><br>
          <img src="${f.flyer}" alt="flyer" style="width:180px; border-radius:10px; margin-top:5px;"><br>
          <a href="${f.link}" target="_blank" style="color:#ff79c6; text-decoration:none;">🔗 Site Oficial</a>
        </div>
      `);
    });
  })
  .catch(err => console.error("Erro ao carregar festivals.json:", err));
