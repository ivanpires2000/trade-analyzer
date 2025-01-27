const analyzeSentiment = (text) => {
    // Lógica para análise de sentimento
    const sentimentScore = Math.random() * 2 - 1; // Exemplo de pontuação de sentimento
    return { text, sentimentScore };
};

module.exports = { analyzeSentiment }; 