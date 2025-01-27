const applyStopLossTakeProfit = (data, scenario) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Dados inválidos');
    }

    if (!scenario || !scenario.stopLossPercent || !scenario.takeProfitPercent) {
        throw new Error('Parâmetros de stop loss e take profit são obrigatórios');
    }

    const trades = [];
    let position = null;

    for (let i = 0; i < data.length; i++) {
        const candle = data[i];

        // Se não tem posição aberta, abre uma nova
        if (!position) {
            position = {
                entryPrice: candle.close,
                stopLoss: candle.close * (1 - scenario.stopLossPercent / 100),
                takeProfit: candle.close * (1 + scenario.takeProfitPercent / 100),
                entryTime: candle.timestamp
            };
            continue;
        }

        // Verifica se atingiu stop loss ou take profit
        if (candle.low <= position.stopLoss) {
            trades.push({
                entryPrice: position.entryPrice,
                exitPrice: position.stopLoss,
                profit: ((position.stopLoss - position.entryPrice) / position.entryPrice) * 100,
                entryTime: position.entryTime,
                exitTime: candle.timestamp,
                exitType: 'STOP_LOSS'
            });
            position = null;
        } else if (candle.high >= position.takeProfit) {
            trades.push({
                entryPrice: position.entryPrice,
                exitPrice: position.takeProfit,
                profit: ((position.takeProfit - position.entryPrice) / position.entryPrice) * 100,
                entryTime: position.entryTime,
                exitTime: candle.timestamp,
                exitType: 'TAKE_PROFIT'
            });
            position = null;
        }
    }

    // Se ainda tem posição aberta no final, fecha no último preço
    if (position) {
        const lastCandle = data[data.length - 1];
        trades.push({
            entryPrice: position.entryPrice,
            exitPrice: lastCandle.close,
            profit: ((lastCandle.close - position.entryPrice) / position.entryPrice) * 100,
            entryTime: position.entryTime,
            exitTime: lastCandle.timestamp,
            exitType: 'FECHAMENTO'
        });
    }

    return trades;
};

module.exports = {
    applyStopLossTakeProfit
}; 