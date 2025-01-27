const sendNotification = (condition, message) => {
    // Lógica para enviar notificação
    console.log(`Notificação: ${message}`);
};

const checkMarketConditions = (data) => {
    // Exemplo de condição: preço abaixo de um limite
    const priceLimit = 100;
    data.forEach(item => {
        if (item.price < priceLimit) {
            sendNotification('price_below_limit', `O preço do ativo ${item.asset} está abaixo de ${priceLimit}`);
        }
    });
};

module.exports = { checkMarketConditions }; 