// Festival data manager
class FestivalData {
    constructor() {
        this.festivals = [];
        this.filteredFestivals = [];
    }

    async loadData() {
        try {
            const response = await fetch('data/festivals.json');
            const data = await response.json();
            this.festivals = data.festivals || [];
            this.filteredFestivals = [...this.festivals];
            return this.festivals;
        } catch (error) {
            console.error('Error loading data:', error);
            return this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.festivals = [
            {
                name: "Boom Festival",
                country: "Portugal", 
                continent: "Europa",
                main_genre: "Psytrance - multigênero",
                subgenres: "Full on, Prog, Night, Forest",
                status: "Ativo",
                lat: 39.784492,
                lng: -7.45194
            },
            {
                name: "ZNA Gathering",
                country: "Portugal",
                continent: "Europa", 
                main_genre: "Psytrance - multigênero",
                subgenres: "Goa, Prog, Night, Forest",
                status: "Ativo",
                lat: 39.070486,
                lng: -8.179916
            }
        ];
        this.filteredFestivals = [...this.festivals];
        return this.festivals;
    }

    filterData(filters) {
        this.filteredFestivals = this.festivals.filter(festival => {
            if (filters.status !== 'all' && festival.status !== filters.status) return false;
            if (filters.continent !== 'all' && festival.continent !== filters.continent) return false;
            if (filters.genre !== 'all' && festival.main_genre !== filters.genre) return false;
            if (filters.search && !festival.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
            return true;
        });
        return this.filteredFestivals;
    }

    getStats() {
        const total = this.festivals.length;
        const active = this.festivals.filter(f => f.status === 'Ativo').length;
        
        const continentStats = {};
        this.festivals.forEach(festival => {
            continentStats[festival.continent] = (continentStats[festival.continent] || 0) + 1;
        });
        
        return { total, active, continentStats };
    }
}
