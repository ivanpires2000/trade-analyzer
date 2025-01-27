const express = require('express');
const cors = require('cors');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Middleware para processar JSON
app.use(express.json());

// Rotas
app.use('/api/trade', tradeRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 