const params = new URLSearchParams(window.location.search);
const festivalId = params.get("id");

fetch("data/festivals.json")
  .then(res => res.json())
  .then(festivals => {
    const festival = festivals.find(f => f.id === festivalId);
    renderFestival(festival);
  });

function renderFestival(f) {
  document.getElementById("festivalName").innerText = f.name;
  document.getElementById("festivalDesc").innerText = f.description;
  document.getElementById("festivalLocation").innerText =
    `${f.city}, ${f.country}`;
  document.getElementById("festivalAirport").innerText = f.airport;

  const map = L.map("festivalMap").setView([f.lat, f.lng], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  L.marker([f.lat, f.lng]).addTo(map);
}

