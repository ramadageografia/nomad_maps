fetch("data/festivals.json")
  .then(res => res.json())
  .then(data => initMap(data));

function initMap(festivals) {
  const map = L.map("festivalMap").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  festivals.forEach(f => {
    L.circleMarker([f.lat, f.lng], {
      radius: 8,
      color: "#00ffcc",
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(`
  <strong>${f["Nome do Festival"]}</strong><br>
  ${f.País}<br>
  <em>${f.Vertente || ""}</em><br><br>

  <a
    href="festival.html?id=${encodeURIComponent(f["Nome do Festival"])}"
    class="popup-btn"
  >
    ✈️ Consultoria de viagem
  </a>
`);

