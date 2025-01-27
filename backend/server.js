// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api/trade', tradeRoutes);

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});