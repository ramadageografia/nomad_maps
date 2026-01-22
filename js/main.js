let map;
let markers = [];
let allFestivals = [];

fetch("data/festivals.json")
  .then(res => {
    if (!res.ok) throw new Error("Erro ao carregar festivals.json");
    return res.json();
  })
  .then(data => {
    console.log("Festivais carregados:", data.length);
    allFestivals = data;
    initFilters(data);
    initMap(data);
    renderList(data);
  })
  .catch(err => console.error(err));

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
    const lat = parseFloat(f.latitude);
    const lon = parseFloat(f.longitude);

    if (isNaN(lat) || isNaN(lon)) return;

    const marker = L.circleMarker([lat, lon], {
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
    .forEach(c =>
      countrySelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${c}">${c}</option>`
      )
    );

  [...new Set(festivals.map(f => f.genre).filter(Boolean))]
    .sort()
    .forEach(g =>
      genreSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${g}">${g}</option>`
      )
    );

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
    const lat = parseFloat(f.latitude);
    const lon = parseFloat(f.longitude);
    if (isNaN(lat) || isNaN(lon)) return;

    const div = document.createElement("div");
    div.className = "festival-item";
    div.innerHTML = `
      <strong>${f.name}</strong><br>
      <small>${f.country} — ${f.genre}</small>
    `;
    div.onclick = () => {
      map.setView([lat, lon], 6);
    };
    container.appendChild(div);
  });
}
