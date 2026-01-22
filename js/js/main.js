/* MOBILE MENU */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

/* MAP */
const map = L.map("festivalMap").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

festivals.forEach(f => {
  L.circleMarker([f.lat, f.lng], {
    radius: 8,
    color: "#00ffcc",
    fillColor: "#00ffcc",
    fillOpacity: 0.7
  })
    .addTo(map)
    .bindPopup(`<strong>${f.name}</strong><br>${f.country}`);
});

