const simulateBacktest = async (data, scenario) => {
    try {
        if (!data || data.length === 0) {
            throw new Error('Dados inválidos para simulação');
        }

        if (!scenario || !scenario.initialBalance || !scenario.stopLoss || !scenario.takeProfit) {
            throw new Error('Parâmetros do cenário inválidos');
        }

        let balance = scenario.initialBalance;
        let position = null;
        const trades = [];
        let winningTrades = 0;
        let losingTrades = 0;

        for (let i = 1; i < data.length; i++) {
            const currentPrice = data[i].close;
            const previousPrice = data[i - 1].close;

            // Se não há posição aberta, verifica sinal de entrada
            if (!position) {
                if (currentPrice > previousPrice) {
                    position = {
                        type: 'COMPRA',
                        entryPrice: currentPrice,
                        quantity: balance / currentPrice,
                        stopLoss: currentPrice * (1 - scenario.stopLoss / 100),
                        takeProfit: currentPrice * (1 + scenario.takeProfit / 100)
                    };
                }
            }
            // Se há posição aberta, verifica condições de saída
            else {
                let exitPrice = null;
                let exitType = null;

                if (currentPrice <= position.stopLoss) {
                    exitPrice = position.stopLoss;
                    exitType = 'STOP_LOSS';
                } else if (currentPrice >= position.takeProfit) {
                    exitPrice = position.takeProfit;
                    exitType = 'TAKE_PROFIT';
                }

                if (exitPrice) {
                    const profit = (exitPrice - position.entryPrice) * position.quantity;
                    balance += profit;

                    trades.push({
                        type: position.type,
                        entryPrice: position.entryPrice,
                        exitPrice: exitPrice,
                        quantity: position.quantity,
                        profit: profit,
                        exitType: exitType
                    });

                    if (profit > 0) winningTrades++;
                    else losingTrades++;

                    position = null;
                }
            }
        }

        // Fecha posição aberta no final da simulação
        if (position) {
            const lastPrice = data[data.length - 1].close;
            const profit = (lastPrice - position.entryPrice) * position.quantity;
            balance += profit;

            trades.push({
                type: position.type,
                entryPrice: position.entryPrice,
                exitPrice: lastPrice,
                quantity: position.quantity,
                profit: profit,
                exitType: 'FINAL_PERIODO'
            });

            if (profit > 0) winningTrades++;
            else losingTrades++;
        }

        const totalTrades = trades.length;
        const successRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        const profitLoss = balance - scenario.initialBalance;
        const profitLossPercentage = (profitLoss / scenario.initialBalance) * 100;

        return {
            finalBalance: balance,
            profitLoss,
            profitLossPercentage,
            totalTrades,
            winningTrades,
            losingTrades,
            successRate,
            trades: trades.slice(-5) // Retorna apenas as últimas 5 operações
        };
    } catch (error) {
        console.error('Erro na simulação:', error);
        throw new Error(`Erro ao simular cenário: ${error.message}`);
    }
};

module.exports = { simulateBacktest }; 