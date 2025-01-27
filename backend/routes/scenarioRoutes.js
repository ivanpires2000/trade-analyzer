const express = require('express');
const { simulateScenario } = require('../services/scenarioService');

const router = express.Router();

router.post('/simulate-scenario', (req, res) => {
    const parameters = req.body;
    try {
        const result = simulateScenario(parameters);
        res.json(result);
    } catch (error) {
        console.error('Erro ao simular cenário:', error.message);
        res.status(500).json({ error: 'Erro ao simular cenário', details: error.message });
    }
});

module.exports = router; 