// NOMAD MAPS - Mapa Interativo de Psytrance
console.log('🎵 TRANCE MAP - Mapa de festivais psytrance carregado!');

// Configurações específicas do mapa psytrance
const TRANCE_CONFIG = {
    // Estilos de música e suas cores
    musicStyles: {
        fullon: { color: '#EF4444', name: 'Full On' },
        darkpsy: { color: '#8B5CF6', name: 'Darkpsy' },
        hitech: { color: '#06B6D4', name: 'Hitech' },
        progressive: { color: '#10B981', name: 'Progressive' },
        forest: { color: '#22C55E', name: 'Forest' },
        psyprog: { color: '#F59E0B', name: 'Psy Progressive' },
        suomi: { color: '#EC4899', name: 'Suomi' },
        zenonesque: { color: '#6366F1', name: 'Zenonesque' }
    },
    
    // Zoom levels para diferentes tipos de visualização
    zoomLevels: {
        world: 2,
        continent: 4,
        country: 6,
        region: 8,
        city: 10,
        venue: 12
    },
    
    // Configurações de performance
    maxMarkers: 100,
    clusterRadius: 50
};

// Funções específicas para o mapa de psytrance
function initTranceMap() {
    console.log('🎵 Inicializando mapa psytrance...');
    
    // Aqui você pode adicionar funcionalidades específicas
    // como clusters de marcadores, heatmaps, etc.
}

// Exportar para uso global
window.TRANCE_CONFIG = TRANCE_CONFIG;
window.initTranceMap = initTranceMap;
