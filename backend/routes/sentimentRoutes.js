const express = require('express');
const { analyzeSentiment } = require('../services/sentimentAnalysisService');

const router = express.Router();

router.post('/analyze-sentiment', (req, res) => {
    const { text } = req.body;
    try {
        const result = analyzeSentiment(text);
        res.json(result);
    } catch (error) {
        console.error('Erro ao analisar sentimento:', error.message);
        res.status(500).json({ error: 'Erro ao analisar sentimento', details: error.message });
    }
});

module.exports = router; 