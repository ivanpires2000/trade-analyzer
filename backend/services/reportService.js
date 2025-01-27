const generateReport = (data) => {
    // Lógica para gerar relatório
    const report = {
        totalTrades: data.length,
        successRate: (data.filter(trade => trade.success).length / data.length) * 100,
        totalProfit: data.reduce((acc, trade) => acc + trade.profit, 0)
    };
    return report;
};

module.exports = { generateReport }; 