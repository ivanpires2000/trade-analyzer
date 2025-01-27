import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api/trade'
});

export const fetchPerformanceData = async (asset, assetType) => {
    try {
        const response = await api.get('/performance', {
            params: { asset, assetType }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de performance:', error);
        throw error;
    }
};

export const analyzeStrategy = async (asset, assetType) => {
    try {
        const response = await api.post('/analyze', { asset, assetType });
        return response.data;
    } catch (error) {
        console.error('Erro ao analisar estratégia:', error);
        throw error;
    }
};

export const simulateScenario = async (asset, assetType, scenario) => {
    try {
        const response = await api.post('/simulate-scenario', {
            asset,
            assetType,
            scenario
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao simular cenário:', error);
        throw error;
    }
};

export default api; 