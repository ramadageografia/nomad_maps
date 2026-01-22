let map;
let markers = [];
let allFestivals = [];

fetch("data/festivals.json")
  .then(res => res.json())
  .then(data => {
    allFestivals = data;
    initFilters(data);
    initMap(data);
    renderList(data);
  });

function initMap(festivals) {
  map = L.map("festivalMap").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  updateMarkers(festivals);
}

function updateMarkers(festivals) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  festivals.forEach(f => {
    if (!f.latitude || !f.longitude) return;

    const marker = L.circleMarker([f.latitude, f.longitude], {
      radius: 6,
      color: "#00ffcc",
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(`
        <strong>${f.name}</strong><br>
        ${f.country}<br>
        <em>${f.genre}</em><br><br>
        <a href="festival.html?id=${encodeURIComponent(f.name)}"
           class="popup-btn">
          ✈️ Consultoria de viagem
        </a>
      `);

    markers.push(marker);
  });
}

function initFilters(festivals) {
  const countrySelect = document.getElementById("filterCountry");
  const genreSelect = document.getElementById("filterGenre");

  [...new Set(festivals.map(f => f.country).filter(Boolean))]
    .sort()
    .forEach(c => countrySelect.innerHTML += `<option value="${c}">${c}</option>`);

  [...new Set(festivals.map(f => f.genre).filter(Boolean))]
    .sort()
    .forEach(g => genreSelect.innerHTML += `<option value="${g}">${g}</option>`);

  countrySelect.addEventListener("change", applyFilters);
  genreSelect.addEventListener("change", applyFilters);
}

function applyFilters() {
  const country = document.getElementById("filterCountry").value;
  const genre = document.getElementById("filterGenre").value;

  const filtered = allFestivals.filter(f =>
    (!country || f.country === country) &&
    (!genre || f.genre === genre)
  );

  updateMarkers(filtered);
  renderList(filtered);
}

function renderList(festivals) {
  const container = document.getElementById("festivalItems");
  container.innerHTML = "";

  festivals.forEach(f => {
    const div = document.createElement("div");
    div.className = "festival-item";
    div.innerHTML = `
      <strong>${f.name}</strong><br>
      <small>${f.country} — ${f.genre}</small>
    `;
    div.onclick = () => {
      map.setView([f.latitude, f.longitude], 6);
    };
    container.appendChild(div);
  });
}
