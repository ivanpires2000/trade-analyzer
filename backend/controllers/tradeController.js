// backend/controllers/tradeController.js
const { fetchTradeData } = require('../services/dataService');

const getTradeData = async (req, res) => {
    const { asset } = req.query;
    try {
        const data = await fetchTradeData(asset);
        res.json(data);
    } catch (error) {
        res.status(500).send('Erro ao buscar dados do ativo');
    }
};

module.exports = { getTradeData };