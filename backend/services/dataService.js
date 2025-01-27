// backend/services/dataService.js
const axios = require('axios');
const { Spot } = require('@binance/connector');

// Configuração do cliente Binance
const client = new Spot(
    process.env.API_KEY,
    process.env.API_SECRET,
    {
        baseURL: 'https://api.binance.com',
        timeout: 5000,
        headers: { 'X-MBX-APIKEY': process.env.API_KEY }
    }
);

const fetchTradeData = async (asset, assetType = 'crypto') => {
    try {
        if (!asset) {
            throw new Error('Asset é obrigatório');
        }

        let data = [];
        const now = Date.now();
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

        if (assetType === 'crypto') {
            const response = await client.klines(asset, '1h', {
                limit: 720,
                startTime: oneMonthAgo,
                endTime: now
            });

            data = response.data.map(k => ({
                timestamp: k[0],
                open: parseFloat(k[1]),
                high: parseFloat(k[2]),
                low: parseFloat(k[3]),
                close: parseFloat(k[4]),
                volume: parseFloat(k[5])
            }));
        } else if (assetType === 'stock') {
            throw new Error('Dados de ações ainda não implementados');
        }

        if (!data || data.length === 0) {
            throw new Error('Nenhum dado encontrado para o ativo');
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw new Error(`Erro ao buscar dados do ativo: ${error.message}`);
    }
};

const fetchPerformanceData = async (asset, assetType = 'crypto') => {
    try {
        const tradeData = await fetchTradeData(asset, assetType);
        
        // Calcula estatísticas diárias
        const dailyStats = tradeData.map((data, index) => ({
            name: new Date(data.timestamp).toLocaleDateString(),
            value: ((data.close - tradeData[0].close) / tradeData[0].close) * 100
        }));

        // Calcula métricas de performance
        let winningTrades = 0;
        let totalTrades = tradeData.length - 1;
        let totalProfit = 0;

        for (let i = 1; i < tradeData.length; i++) {
            const profit = ((tradeData[i].close - tradeData[i-1].close) / tradeData[i-1].close) * 100;
            if (profit > 0) winningTrades++;
            totalProfit += profit;
        }

        // Gera operações recentes simuladas
        const recentTrades = tradeData.slice(-5).map((data, index) => ({
            date: new Date(data.timestamp).toISOString(),
            type: data.close > tradeData[Math.max(0, tradeData.length - 6 + index)].close ? 'COMPRA' : 'VENDA',
            price: data.close,
            profit: index > 0 ? ((data.close - tradeData[tradeData.length - 6 + index].close) / tradeData[tradeData.length - 6 + index].close) * 100 : 0
        }));

        return {
            asset,
            assetType,
            dailyStats,
            successRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
            totalProfit: totalProfit,
            recentTrades,
            lastUpdate: new Date().toISOString()
        };
    } catch (error) {
        console.error('Erro ao calcular performance:', error);
        throw new Error(`Erro ao calcular dados de performance: ${error.message}`);
    }
};

module.exports = {
    fetchTradeData,
    fetchPerformanceData
};