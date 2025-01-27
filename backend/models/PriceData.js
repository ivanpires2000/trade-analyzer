const mongoose = require('mongoose');

const PriceDataSchema = new mongoose.Schema({
    asset: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    volume: { type: Number },
    high: { type: Number },
    low: { type: Number }
});

module.exports = mongoose.model('PriceData', PriceDataSchema); 