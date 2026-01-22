fetch("data/festivals.json")
  .then(res => res.json())
  .then(festivals => initMap(festivals));

function initMap(festivals) {
  const map = L.map("festivalMap", {
    center: [20, 0],
    zoom: 2,
    zoomControl: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  festivals.forEach(f => {
    const lat = parseFloat(f.latitude);
    const lon = parseFloat(f.longitude);
    if (isNaN(lat) || isNaN(lon)) return;

    L.circleMarker([lat, lon], {
      radius: 6,
      color: "#00ffcc",
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(`
        <strong>${f.name}</strong><br>
        ${f.country}<br>
        <em>${f.genre}</em><br><br>
        <a 
          href="festival.html?id=${encodeURIComponent(f.name)}"
          class="popup-btn"
        >
          ✈️ Consultoria de viagem
        </a>
      `);
  });
}
