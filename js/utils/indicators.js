// Technical indicators calculation utilities
export function calculateMA(klines, period) {
    const closes = klines.map(k => k.close);
    const ma = [];
    
    for (let i = period - 1; i < closes.length; i++) {
        const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / period);
    }
    
    return ma;
}

export function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const ema = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
        ema.push(data[i] * k + ema[i-1] * (1-k));
    }
    
    return ema;
}

export function calculateRSI(klines, period) {
    const changes = [];
    for (let i = 1; i < klines.length; i++) {
        changes.push(klines[i].close - klines[i-1].close);
    }
    
    let gains = changes.map(c => c > 0 ? c : 0);
    let losses = changes.map(c => c < 0 ? -c : 0);
    
    const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

export function calculateMACD(klines) {
    const closes = klines.map(k => k.close);
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    
    return {
        macdLine,
        signalLine,
        histogram: macdLine.map((v, i) => v - signalLine[i])
    };
}