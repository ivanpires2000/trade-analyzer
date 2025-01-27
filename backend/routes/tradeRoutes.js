// backend/routes/tradeRoutes.js
const express = require('express');
const router = express.Router();
const { fetchTradeData, fetchPerformanceData } = require('../services/dataService');
const { calculateMovingAverage, calculateRSI, calculateMACD } = require('../services/technicalAnalysis');
const { simulateBacktest } = require('../services/backtestingService');
const { applyStopLossTakeProfit } = require('../services/tradeStrategyService');

// Rota para análise de estratégias
router.post('/analyze', async (req, res) => {
    try {
        const { asset, assetType } = req.body;
        if (!asset || !assetType) {
            return res.status(400).json({ error: 'Asset e tipo do ativo são obrigatórios' });
        }

        const data = await fetchTradeData(asset, assetType);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Dados não encontrados para o ativo' });
        }

        // Calcular indicadores técnicos
        const prices = data.map(d => d.close);
        const volumes = data.map(d => d.volume);
        const sma20 = calculateMovingAverage(prices, 20);
        const rsi = calculateRSI(prices, 14);
        const macd = calculateMACD(prices);

        // Análise de tendência
        const lastPrice = prices[prices.length - 1];
        const lastSMA = sma20[sma20.length - 1];
        const lastRSI = rsi[rsi.length - 1];
        const lastMACD = macd.macdLine[macd.macdLine.length - 1];
        const lastSignal = macd.signalLine[macd.signalLine.length - 1];

        // Gerar sinais
        let signal = 'AGUARDAR';
        let confidence = 0;

        if (lastPrice > lastSMA && lastRSI < 70 && lastMACD > lastSignal) {
            signal = 'COMPRA';
            confidence = Math.min(((lastRSI - 30) / 40) * 100, 100);
        } else if (lastPrice < lastSMA && lastRSI > 30 && lastMACD < lastSignal) {
            signal = 'VENDA';
            confidence = Math.min(((70 - lastRSI) / 40) * 100, 100);
        }

        res.json({
            asset,
            timestamp: new Date().toISOString(),
            technicalAnalysis: {
                sma20: lastSMA,
                rsi: lastRSI,
                macd: {
                    macdLine: lastMACD,
                    signalLine: lastSignal
                }
            },
            signal,
            confidence
        });
    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({ error: 'Erro ao analisar estratégias' });
    }
});

// Rota para buscar dados de trading
router.get('/data', async (req, res) => {
    try {
        const { asset, assetType } = req.query;
        if (!asset) {
            return res.status(400).json({ error: 'Asset é obrigatório' });
        }
        const data = await fetchTradeData(asset, assetType);
        return res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

// Rota para simular cenários
router.post('/simulate-scenario', async (req, res) => {
    try {
        const { asset, assetType, scenario } = req.body;
        if (!asset || !scenario) {
            return res.status(400).json({ error: 'Asset e cenário são obrigatórios' });
        }

        const data = await fetchTradeData(asset, assetType);
        const result = await simulateBacktest(data, scenario);

        res.json({
            asset,
            scenario,
            result
        });
    } catch (error) {
        console.error('Erro ao simular cenário:', error);
        res.status(500).json({ error: 'Erro ao simular cenário' });
    }
});

// Rota para dados de performance
router.get('/performance', async (req, res) => {
    try {
        const { asset, assetType } = req.query;
        if (!asset) {
            return res.status(400).json({ error: 'Asset é obrigatório' });
        }

        const data = await fetchPerformanceData(asset, assetType);
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar performance:', error);
        res.status(500).json({ error: 'Erro ao buscar dados de performance' });
    }
});

module.exports = router;