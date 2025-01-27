// Estratégias baseadas em traders famosos e técnicas comprovadas
const calculateTrendFollowing = (prices, period = 20) => {
    // Estratégia de Seguimento de Tendência (baseada em Bill Dunn)
    const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
    const currentPrice = prices[prices.length - 1];
    return {
        signal: currentPrice > sma ? 'COMPRA' : 'VENDA',
        strength: Math.abs((currentPrice - sma) / sma) * 100,
        indicator: 'SMA'
    };
};

const calculateBreakoutStrategy = (prices, period = 20) => {
    // Estratégia de Breakout (baseada em Richard Dennis)
    const recentPrices = prices.slice(-period);
    const highestHigh = Math.max(...recentPrices);
    const lowestLow = Math.min(...recentPrices);
    const currentPrice = prices[prices.length - 1];
    
    return {
        signal: currentPrice > highestHigh ? 'COMPRA' : currentPrice < lowestLow ? 'VENDA' : 'AGUARDAR',
        strength: Math.abs((currentPrice - (highestHigh + lowestLow) / 2) / currentPrice) * 100,
        indicator: 'Breakout'
    };
};

const calculateSwingTrading = (prices, rsiPeriod = 14) => {
    // Estratégia de Swing Trading (baseada em Linda Raschke)
    const calculateRSI = (prices, period) => {
        let gains = 0;
        let losses = 0;
        
        for (let i = prices.length - period; i < prices.length; i++) {
            const difference = prices[i] - prices[i - 1];
            if (difference >= 0) {
                gains += difference;
            } else {
                losses -= difference;
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    };

    const rsi = calculateRSI(prices, rsiPeriod);
    
    return {
        signal: rsi < 30 ? 'COMPRA' : rsi > 70 ? 'VENDA' : 'AGUARDAR',
        strength: Math.abs(50 - rsi),
        indicator: 'RSI'
    };
};

const calculateMomentum = (prices, period = 10) => {
    const momentum = prices[prices.length - 1] - prices[prices.length - period - 1];
    const velocity = momentum / period;
    const strength = (momentum / prices[prices.length - period - 1]) * 100;
    
    return {
        signal: momentum > 0 ? 'COMPRA' : momentum < 0 ? 'VENDA' : 'AGUARDAR',
        strength: Math.abs(strength),
        velocity,
        indicator: 'Momentum'
    };
};

const calculateMeanReversion = (prices, period = 20) => {
    const mean = prices.slice(-period).reduce((a, b) => a + b) / period;
    const currentPrice = prices[prices.length - 1];
    const deviation = ((currentPrice - mean) / mean) * 100;
    const stdDev = Math.sqrt(
        prices.slice(-period).reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period
    );
    
    const zScore = (currentPrice - mean) / stdDev;
    const reversionProbability = Math.min(Math.abs(zScore) * 25, 100);
    
    return {
        signal: deviation < -2 ? 'COMPRA' : deviation > 2 ? 'VENDA' : 'AGUARDAR',
        deviation,
        reversionProbability,
        indicator: 'Mean Reversion'
    };
};

const calculateVolatilityBreakout = (prices, period = 20) => {
    const volatility = Math.sqrt(
        prices.slice(-period).reduce((sum, price, i, arr) => {
            if (i === 0) return sum;
            return sum + Math.pow(price - arr[i-1], 2);
        }, 0) / (period - 1)
    );
    
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    const breakoutLevel = (volatility / previousPrice) * 100;
    
    return {
        signal: Math.abs(priceChange) > breakoutLevel ? (priceChange > 0 ? 'COMPRA' : 'VENDA') : 'AGUARDAR',
        currentVolatility: (volatility / previousPrice) * 100,
        breakoutLevel,
        indicator: 'Volatility'
    };
};

const calculatePriceAction = (prices, volumes, period = 20) => {
    const recentPrices = prices.slice(-period);
    const recentVolumes = volumes.slice(-period);
    const currentPrice = prices[prices.length - 1];
    const avgVolume = recentVolumes.reduce((a, b) => a + b) / period;
    const currentVolume = volumes[volumes.length - 1];
    
    let pattern = 'Indefinido';
    if (recentPrices.every((price, i) => i === 0 || price >= recentPrices[i-1])) {
        pattern = 'Tendência de Alta';
    } else if (recentPrices.every((price, i) => i === 0 || price <= recentPrices[i-1])) {
        pattern = 'Tendência de Baixa';
    }
    
    const reliability = Math.min((currentVolume / avgVolume) * 100, 100);
    
    return {
        signal: pattern.includes('Alta') ? 'COMPRA' : pattern.includes('Baixa') ? 'VENDA' : 'AGUARDAR',
        pattern,
        reliability,
        indicator: 'Price Action'
    };
};

const calculateMarketProfile = (prices, volumes) => {
    const valueArea = prices.reduce((sum, price, i) => sum + price * volumes[i], 0) / 
                     volumes.reduce((a, b) => a + b, 0);
    
    const volumeProfile = prices.reduce((profile, price, i) => {
        const priceLevel = Math.round(price);
        profile[priceLevel] = (profile[priceLevel] || 0) + volumes[i];
        return profile;
    }, {});
    
    const sortedLevels = Object.entries(volumeProfile)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([price]) => price)
        .join(', ');
    
    return {
        valueArea: valueArea,
        volumeDistribution: 'Normal',
        controlPoints: sortedLevels,
        indicator: 'Market Profile'
    };
};

const calculateOrderFlow = (prices, volumes) => {
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    const currentVolume = volumes[volumes.length - 1];
    const previousVolume = volumes[volumes.length - 2];
    
    const volumeDelta = currentVolume - previousVolume;
    const imbalance = (volumeDelta / previousVolume) * 100;
    
    return {
        dominantPressure: volumeDelta > 0 ? 'Compradora' : 'Vendedora',
        volumeDelta,
        imbalance,
        indicator: 'Order Flow'
    };
};

const calculatePositionSizing = (accountBalance, riskPercentage, entryPrice, stopLoss) => {
    // Gestão de Risco (baseada em Van K. Tharp)
    const riskAmount = accountBalance * (riskPercentage / 100);
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    const position = Math.floor(riskAmount / riskPerShare);
    
    return {
        positionSize: position,
        totalRisk: position * riskPerShare,
        riskPercentage: riskPercentage
    };
};

const analyzeMarketConditions = (prices, volume) => {
    // Análise de Condições de Mercado (baseada em Mark Minervini)
    const volatility = calculateVolatility(prices);
    const volumeStrength = analyzeVolumeStrength(volume);
    const trend = identifyTrend(prices);
    
    return {
        marketCondition: determineMarketCondition(volatility, volumeStrength, trend),
        volatility,
        volumeStrength,
        trend
    };
};

// Funções auxiliares
const calculateVolatility = (prices) => {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    const std = Math.sqrt(returns.reduce((a, b) => a + b * b, 0) / returns.length);
    return std * Math.sqrt(252) * 100; // Anualizado
};

const analyzeVolumeStrength = (volume) => {
    const avgVolume = volume.reduce((a, b) => a + b, 0) / volume.length;
    const currentVolume = volume[volume.length - 1];
    return {
        strength: (currentVolume / avgVolume) * 100,
        trend: currentVolume > avgVolume ? 'AUMENTANDO' : 'DIMINUINDO'
    };
};

const identifyTrend = (prices) => {
    const sma20 = prices.slice(-20).reduce((a, b) => a + b) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b) / 50;
    const currentPrice = prices[prices.length - 1];
    
    if (currentPrice > sma20 && sma20 > sma50) return 'ALTA';
    if (currentPrice < sma20 && sma20 < sma50) return 'BAIXA';
    return 'LATERAL';
};

const determineMarketCondition = (volatility, volumeStrength, trend) => {
    if (volatility > 20 && volumeStrength.strength > 120 && trend === 'ALTA')
        return 'FORTE_ALTA';
    if (volatility > 20 && volumeStrength.strength > 120 && trend === 'BAIXA')
        return 'FORTE_BAIXA';
    if (volatility < 10 && volumeStrength.strength < 80)
        return 'CONSOLIDAÇÃO';
    return 'NEUTRO';
};

const calculateCarolPaifer = (prices, volumes) => {
    // Estratégia baseada em Price Action da Carol Paifer
    const period = 20;
    const recentPrices = prices.slice(-period);
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    
    // Identificação de tendência
    const sma20 = recentPrices.reduce((a, b) => a + b) / period;
    const trend = currentPrice > sma20 ? 'ALTA' : 'BAIXA';
    
    // Análise de confluências
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    const volumeStrength = volumes[volumes.length - 1] > volumes[volumes.length - 2] ? 'FORTE' : 'FRACO';
    
    return {
        signal: trend === 'ALTA' && volumeStrength === 'FORTE' ? 'COMPRA' : 'VENDA',
        trend: trend,
        volumeStrength: volumeStrength,
        priceChange: priceChange,
        indicator: 'Price Action'
    };
};

const calculateThalitaMalago = (prices, volumes) => {
    // Estratégia baseada em Tape Reading da Thalita Malagó
    const currentVolume = volumes[volumes.length - 1];
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b) / 20;
    const volumeRatio = currentVolume / avgVolume;
    
    const priceChange = prices[prices.length - 1] - prices[prices.length - 2];
    const volumeChange = currentVolume - volumes[volumes.length - 2];
    
    return {
        signal: volumeRatio > 1.5 && priceChange > 0 ? 'COMPRA' : 'VENDA',
        volumeStrength: volumeRatio,
        volumeDelta: volumeChange,
        indicator: 'Tape Reading'
    };
};

const calculateFloMenezes = (prices, volumes) => {
    // Estratégia baseada em Momentum da Flo Menezes
    const period = 10;
    const recentPrices = prices.slice(-period);
    const momentum = prices[prices.length - 1] - prices[prices.length - period];
    const velocity = momentum / period;
    
    // Análise de volume
    const volumeSum = volumes.slice(-period).reduce((a, b) => a + b);
    const avgVolume = volumeSum / period;
    const currentVolume = volumes[volumes.length - 1];
    
    return {
        signal: momentum > 0 && currentVolume > avgVolume ? 'COMPRA' : 'VENDA',
        momentum: momentum,
        velocity: velocity,
        volumeStrength: (currentVolume / avgVolume) * 100,
        indicator: 'Momentum'
    };
};

const calculateLuizBarsi = (prices, volumes) => {
    // Simulação simplificada da estratégia Barsi
    const period = 20;
    const priceAvg = prices.slice(-period).reduce((a, b) => a + b) / period;
    const currentPrice = prices[prices.length - 1];
    const priceDeviation = ((currentPrice - priceAvg) / priceAvg) * 100;
    
    return {
        signal: priceDeviation < -10 ? 'COMPRA' : priceDeviation > 10 ? 'VENDA' : 'AGUARDAR',
        priceDeviation: priceDeviation,
        valueZone: priceDeviation < -10 ? 'DESCONTO' : priceDeviation > 10 ? 'SOBREVALORIZADO' : 'JUSTO',
        indicator: 'Value'
    };
};

const calculateTassoLagoScalping = (prices, volumes) => {
    // Análise de Scalping do Tasso Lago
    const period = 5; // Período curto para scalping
    const recentPrices = prices.slice(-period);
    const recentVolumes = volumes.slice(-period);
    
    // Análise do perfil de volume
    const avgVolume = recentVolumes.reduce((a, b) => a + b) / period;
    const currentVolume = volumes[volumes.length - 1];
    const volumeStrength = (currentVolume / avgVolume) * 100;

    // Análise de price action
    const priceChange = prices[prices.length - 1] - prices[prices.length - 2];
    const priceAction = priceChange > 0 ? 'ALTA' : priceChange < 0 ? 'BAIXA' : 'LATERAL';

    // Time & Trade (simulação simplificada)
    const timeAndTrade = volumeStrength > 150 ? 'AGRESSÃO COMPRADORA' : 
                        volumeStrength < 50 ? 'AGRESSÃO VENDEDORA' : 'NEUTRO';

    return {
        signal: volumeStrength > 120 && priceAction === 'ALTA' ? 'COMPRA' : 
                volumeStrength > 120 && priceAction === 'BAIXA' ? 'VENDA' : 'AGUARDAR',
        volumeProfile: volumeStrength > 100 ? 'FORTE' : 'FRACO',
        priceAction: priceAction,
        volumeStrength: volumeStrength.toFixed(2),
        timeAndTrade: timeAndTrade,
        indicator: 'Scalping'
    };
};

const calculateTassoLagoTendencia = (prices, volumes) => {
    // Análise de Tendência do Tasso Lago
    const period = 20;
    const recentPrices = prices.slice(-period);
    const recentVolumes = volumes.slice(-period);

    // Identificação de tendência
    const sma20 = recentPrices.reduce((a, b) => a + b) / period;
    const currentPrice = prices[prices.length - 1];
    const trend = currentPrice > sma20 ? 'ALTA' : 'BAIXA';

    // Cálculo de momentum
    const momentum = ((currentPrice - prices[prices.length - period]) / prices[prices.length - period]) * 100;

    // Confirmação de volume
    const avgVolume = recentVolumes.reduce((a, b) => a + b) / period;
    const volumeConfirmation = volumes[volumes.length - 1] > avgVolume;

    // Análise de pullback
    const lastFivePrices = prices.slice(-5);
    const isPullback = trend === 'ALTA' ? 
        Math.min(...lastFivePrices) < currentPrice : 
        Math.max(...lastFivePrices) > currentPrice;

    return {
        signal: trend === 'ALTA' && volumeConfirmation && momentum > 0 ? 'COMPRA' : 
                trend === 'BAIXA' && volumeConfirmation && momentum < 0 ? 'VENDA' : 'AGUARDAR',
        trend: trend,
        momentum: momentum.toFixed(2),
        volumeConfirmation: volumeConfirmation ? 'CONFIRMADO' : 'NÃO CONFIRMADO',
        pullback: isPullback ? 'IDENTIFICADO' : 'NÃO IDENTIFICADO',
        indicator: 'Tendência'
    };
};

const calculateTassoLagoRompimento = (prices, volumes) => {
    // Análise de Rompimento do Tasso Lago
    const period = 20;
    const recentPrices = prices.slice(-period);
    const recentVolumes = volumes.slice(-period);

    // Identificar níveis de suporte e resistência
    const maxPrice = Math.max(...recentPrices.slice(0, -1));
    const minPrice = Math.min(...recentPrices.slice(0, -1));
    const currentPrice = prices[prices.length - 1];

    // Análise de volume no rompimento
    const avgVolume = recentVolumes.reduce((a, b) => a + b) / period;
    const currentVolume = volumes[volumes.length - 1];
    const volumeBreakout = (currentVolume / avgVolume) * 100;

    // Verificar consolidação antes do rompimento
    const priceRange = maxPrice - minPrice;
    const avgPriceRange = priceRange / period;
    const isConsolidation = avgPriceRange < (maxPrice * 0.01); // Menos de 1% de variação

    // Determinar tipo de rompimento
    let breakoutType = 'NENHUM';
    if (currentPrice > maxPrice && currentVolume > avgVolume * 1.5) {
        breakoutType = 'ALTA';
    } else if (currentPrice < minPrice && currentVolume > avgVolume * 1.5) {
        breakoutType = 'BAIXA';
    }

    return {
        signal: breakoutType === 'ALTA' ? 'COMPRA' : 
                breakoutType === 'BAIXA' ? 'VENDA' : 'AGUARDAR',
        breakoutLevel: breakoutType === 'ALTA' ? maxPrice.toFixed(2) : 
                      breakoutType === 'BAIXA' ? minPrice.toFixed(2) : 'N/A',
        volumeBreakout: volumeBreakout.toFixed(2) + '%',
        priceAction: breakoutType,
        consolidation: isConsolidation ? 'CONFIRMADA' : 'NÃO CONFIRMADA',
        indicator: 'Rompimento'
    };
};

module.exports = {
    calculateTrendFollowing,
    calculateBreakoutStrategy,
    calculateSwingTrading,
    calculateMomentum,
    calculateMeanReversion,
    calculateVolatilityBreakout,
    calculatePriceAction,
    calculateMarketProfile,
    calculateOrderFlow,
    calculatePositionSizing,
    calculateCarolPaifer,
    calculateThalitaMalago,
    calculateFloMenezes,
    calculateLuizBarsi,
    analyzeMarketConditions,
    calculateVolatility,
    analyzeVolumeStrength,
    identifyTrend,
    determineMarketCondition,
    calculateTassoLagoScalping,
    calculateTassoLagoTendencia,
    calculateTassoLagoRompimento
}; 