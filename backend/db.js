const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/trade-analyzer');
        console.log('MongoDB conectado com sucesso');
        return true;
    } catch (error) {
        console.error('Aviso: MongoDB não está disponível:', error.message);
        console.log('O servidor continuará funcionando com funcionalidades limitadas');
        return false;
    }
};

module.exports = connectDB; 