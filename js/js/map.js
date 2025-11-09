// Map manager
class NomadMap {
    constructor() {
        this.map = null;
        this.markers = null;
    }

    init(containerId) {
        this.map = L.map(containerId).setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.markers = L.markerClusterGroup();
        this.map.addLayer(this.markers);

        return this.map;
    }

    updateMarkers(festivals) {
        this.markers.clearLayers();
        
        festivals.forEach(festival => {
            const marker = L.marker([festival.lat, festival.lng]);
            
            const icon = this.createIcon(festival);
            marker.setIcon(icon);
            
            marker.bindPopup(this.createPopup(festival));
            this.markers.addLayer(marker);
        });
    }

    createIcon(festival) {
        let color = '#28a745';
        if (festival.status === 'Inativo') color = '#6c757d';
        if (festival.main_genre.includes('Darkpsy') || festival.main_genre.includes('Hitech')) color = '#dc3545';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${color}; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16]
        });
    }

    createPopup(festival) {
        return `
            <div class="festival-popup">
                <h3>${festival.name}</h3>
                <div class="info-row">
                    <span class="info-label">País:</span>
                    <span>${festival.country}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-${festival.status.toLowerCase()}">${festival.status}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Gênero:</span>
                    <span>${festival.main_genre}</span>
                </div>
            </div>
        `;
    }

    fitBounds() {
        if (this.markers.getLayers().length > 0) {
            this.map.fitBounds(this.markers.getBounds());
        }
    }
}
