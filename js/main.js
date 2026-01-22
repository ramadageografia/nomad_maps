// Inicializa o mapa
const map = L.map("festivalMap").setView([20, 0], 2);

// Camada base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

// DADOS EMBUTIDOS (use este padrão por enquanto)
const festivalsData = [
  {
    nome: "Ozora Festival",
    pais: "Hungria",
    vertente: "Psytrance / Visionary Art",
    lat: 46.77,
    lon: 18.41
  },
  {
    nome: "Boom Festival",
    pais: "Portugal",
    vertente: "Psytrance / Arte & Sustentabilidade",
    lat: 39.716,
    lon: -7.492
  }
];

// Adiciona pontos ao mapa
festivalsData.forEach(festival => {
  if (!festival.lat || !festival.lon) return;

  L.circleMarker([festival.lat, festival.lon], {
    radius: 6,
    color: "#00ffcc",
    fillOpacity: 0.8
  })
    .addTo(map)
    .bindPopup(`
      <strong>${festival.nome}</strong><br>
      ${festival.pais}<br>
      <em>${festival.vertente}</em><br><br>

      <a
        href="festival.html?id=${encodeURIComponent(festival.nome)}"
        class="popup-btn"
      >
        ✈️ Consultoria de viagem
      </a>
    `);
});
