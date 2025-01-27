const saveStrategy = (strategy) => {
    // Lógica para salvar a estratégia
    console.log(`Estratégia salva: ${strategy.name}`);
    return { message: 'Estratégia salva com sucesso!' };
};

module.exports = { saveStrategy }; 