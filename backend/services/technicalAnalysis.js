const calculateMovingAverage = (data, period) => {
    return data.map((val, index, arr) => {
        if (index < period - 1) return null;
        const slice = arr.slice(index - period + 1, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr, 0);
        return sum / period;
    });
};

const calculateRSI = (data, period = 14) => {
    let gains = 0, losses = 0;
    const rsi = [];
    for (let i = 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        if (change > 0) gains += change;
        else losses -= change;

        if (i >= period) {
            const avgGain = gains / period;
            const avgLoss = losses / period;
            const rs = avgGain / avgLoss;
            rsi.push(100 - 100 / (1 + rs));

            const firstChange = data[i - period + 1] - data[i - period];
            if (firstChange > 0) gains -= firstChange;
            else losses += firstChange;
        } else {
            rsi.push(null);
        }
    }
    return rsi;
};

const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
    const shortEMA = calculateEMA(data, shortPeriod);
    const longEMA = calculateEMA(data, longPeriod);
    const macdLine = shortEMA.map((val, index) => (val !== null && longEMA[index] !== null) ? val - longEMA[index] : null);
    const signalLine = calculateEMA(macdLine.filter(val => val !== null), signalPeriod);
    return { macdLine, signalLine };
};

const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    return data.map((val, index, arr) => {
        if (index < period - 1) return null;
        if (index === period - 1) {
            const slice = arr.slice(0, period);
            const sum = slice.reduce((acc, curr) => acc + curr, 0);
            return sum / period;
        }
        return val * k + arr[index - 1] * (1 - k);
    });
};

module.exports = { calculateMovingAverage, calculateRSI, calculateMACD }; 