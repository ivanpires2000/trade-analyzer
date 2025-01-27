const express = require('express');
const { saveStrategy } = require('../services/strategyService');

const router = express.Router();

router.post('/customize-strategy', (req, res) => {
    const strategy = req.body;
    try {
        const result = saveStrategy(strategy);
        res.json(result);
    } catch (error) {
        console.error('Erro ao salvar estratégia:', error.message);
        res.status(500).json({ error: 'Erro ao salvar estratégia', details: error.message });
    }
});

module.exports = router; 