// Inicializa o mapa
const map = L.map('trance-map', {
  center: [20, 0],
  zoom: 2,
  worldCopyJump: true,
  zoomControl: true
});

// Adiciona camada base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Cluster para os marcadores
const markers = L.markerClusterGroup();

// Exemplo: estrutura JSON dos festivais (você pode importar externamente também)
const festivals = [
  {
    "nome": "Boom Festival",
    "pais": "Portugal",
    "lat": 39.5665,
    "lng": -7.8422,
    "icone": "boom.png",
    "flyer": "boom.jpg"
  },
  {
    "nome": "Ozora Festival",
    "pais": "Hungria",
    "lat": 46.900,
    "lng": 18.700,
    "icone": "ozora.png",
    "flyer": "ozora.jpg"
  },
  {
    "nome": "Hadra Trance Festival",
    "pais": "França",
    "lat": 45.1885,
    "lng": 5.7245,
    "icone": "hadra.png",
    "flyer": "hadra.jpg"
  }
  // ... adicione todos os outros festivais aqui ou importe de JSON
];

// Cria o elemento flutuante para o flyer
const flyerPopup = document.createElement('div');
flyerPopup.classList.add('flyer-popup');
const flyerImg = document.createElement('img');
flyerPopup.appendChild(flyerImg);
document.body.appendChild(flyerPopup);

// Função para criar marcador com ícone e flyer flutuante
festivals.forEach(festival => {
  const iconePersonalizado = L.icon({
    iconUrl: `assets/Imagens/icones/${festival.nome.toLowerCase().replace(/ /g, '-')}/${festival.icone}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const marker = L.marker([festival.lat, festival.lng], { icon: iconePersonalizado });

  marker.bindPopup(`<b>${festival.nome}</b><br>${festival.pais}`);

  marker.on('mouseover', function (e) {
    flyerImg.src = `assets/Imagens/flyers/${festival.nome.toLowerCase().replace(/ /g, '-')}/${festival.flyer}`;
    flyerPopup.style.display = 'block';
  });

  marker.on('mousemove', function (e) {
    flyerPopup.style.left = (e.originalEvent.pageX + 15) + 'px';
    flyerPopup.style.top = (e.originalEvent.pageY - 10) + 'px';
  });

  marker.on('mouseout', function () {
    flyerPopup.style.display = 'none';
  });

  markers.addLayer(marker);
});

// Adiciona todos os marcadores ao mapa
map.addLayer(markers);
