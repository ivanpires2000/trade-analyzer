const express = require('express');
const { generateReport } = require('../services/reportService');

const router = express.Router();

router.post('/generate-report', (req, res) => {
    const data = req.body;
    try {
        const report = generateReport(data);
        res.json(report);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error.message);
        res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
    }
});

module.exports = router; 