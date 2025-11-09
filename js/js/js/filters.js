// Filter manager
class FilterManager {
    constructor(dataManager, mapManager) {
        this.dataManager = dataManager;
        this.mapManager = mapManager;
        this.filters = {
            status: 'all',
            continent: 'all', 
            genre: 'all',
            search: ''
        };
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.applyFilter('status', e.target.value);
        });

        document.getElementById('continent-filter').addEventListener('change', (e) => {
            this.applyFilter('continent', e.target.value);
        });

        document.getElementById('genre-filter').addEventListener('change', (e) => {
            this.applyFilter('genre', e.target.value);
        });

        document.getElementById('search-filter').addEventListener('input', (e) => {
            this.applyFilter('search', e.target.value);
        });

        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    applyFilter(type, value) {
        this.filters[type] = value;
        this.update();
    }

    update() {
        const filtered = this.dataManager.filterData(this.filters);
        this.mapManager.updateMarkers(filtered);
        this.updateStats();
        this.mapManager.fitBounds();
    }

    updateStats() {
        const stats = this.dataManager.getStats();
        document.getElementById('total-festivals').textContent = stats.total;
        document.getElementById('active-festivals').textContent = stats.active;
        
        const continentStats = document.getElementById('continent-stats');
        continentStats.innerHTML = '';
        
        Object.entries(stats.continentStats).forEach(([continent, count]) => {
            const div = document.createElement('div');
            div.className = 'continent-stat-item';
            div.innerHTML = `<span>${continent}:</span> <span style="color:#667eea; font-weight:bold;">${count}</span>`;
            continentStats.appendChild(div);
        });
    }

    resetFilters() {
        document.getElementById('status-filter').value = 'all';
        document.getElementById('continent-filter').value = 'all';
        document.getElementById('genre-filter').value = 'all';
        document.getElementById('search-filter').value = '';
        
        this.filters = {
            status: 'all',
            continent: 'all',
            genre: 'all',
            search: ''
        };
        
        this.update();
    }
}
