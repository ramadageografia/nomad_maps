
// Basic Leaflet map with sample festival markers and Plotly placeholder
document.addEventListener('DOMContentLoaded', function(){
  // Leaflet map
  var map = L.map('leafletMap').setView([20, 0], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap, &copy;CartoDB'
  }).addTo(map);

  // Example festival markers (replace or extend this array)
  var festivals = [
    {name: 'Boom Festival', coords: [39.5932, -8.4467], country: 'Portugal', date: 'Jul 2026', price: 'R$ 7.990'},
    {name: 'Ozora Festival', coords: [46.9, 18.5], country: 'Hungary', date: 'Aug 2026', price: 'R$ 6.800'},
    {name: 'Universo Paralello', coords: [-13.3167, -38.9667], country: 'Brasil', date: 'Dec 2025', price: 'R$ 4.500'}
  ];

  festivals.forEach(function(f){
    var ic = L.divIcon({className: 'marker-div-icon', html: '<i style="font-size:20px;color: #00ffc8;" class="fas fa-map-pin"></i>', iconSize:[30,30]});
    L.marker(f.coords, {icon: ic}).addTo(map).bindPopup('<b>'+f.name+'</b><br/>'+f.country+' - '+f.date+'<br/>'+f.price);
  });

  // Plotly placeholder chart - ready to receive external data
  var plotData = [{
    x: ['Europa','América do Sul','Ásia','Oceania','América do Norte'],
    y: [14,9,4,2,3],
    type: 'bar'
  }];

  Plotly.newPlot('plotlyChart', plotData, {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {color: '#ffffff'}
  }, {responsive: true});
});
