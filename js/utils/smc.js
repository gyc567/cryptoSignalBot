// Smart Money Concept (SMC) Analysis Utilities
export function findLiquidity(klines) {
    const highs = [];
    const lows = [];
    
    // Find significant liquidity levels
    for (let i = 1; i < klines.length - 1; i++) {
        // Higher high followed by lower high = potential liquidity level
        if (klines[i].high > klines[i-1].high && klines[i].high > klines[i+1].high) {
            highs.push({
                price: klines[i].high,
                volume: klines[i].volume,
                type: 'resistance'
            });
        }
        // Lower low followed by higher low = potential liquidity level
        if (klines[i].low < klines[i-1].low && klines[i].low < klines[i+1].low) {
            lows.push({
                price: klines[i].low,
                volume: klines[i].volume,
                type: 'support'
            });
        }
    }
    
    return { highs, lows };
}

export function findOrderBlocks(klines) {
    const bullishOB = [];
    const bearishOB = [];
    
    for (let i = 2; i < klines.length - 1; i++) {
        // Bullish Order Block: Strong bearish candle followed by strong bullish move
        if (klines[i-1].close < klines[i-1].open && // Bearish candle
            klines[i].close > klines[i].open && // Bullish candle
            klines[i].close > klines[i-1].high) { // Strong move up
            bullishOB.push({
                high: klines[i-1].high,
                low: klines[i-1].low,
                volume: klines[i-1].volume
            });
        }
        
        // Bearish Order Block: Strong bullish candle followed by strong bearish move
        if (klines[i-1].close > klines[i-1].open && // Bullish candle
            klines[i].close < klines[i].open && // Bearish candle
            klines[i].close < klines[i-1].low) { // Strong move down
            bearishOB.push({
                high: klines[i-1].high,
                low: klines[i-1].low,
                volume: klines[i-1].volume
            });
        }
    }
    
    return { bullishOB, bearishOB };
}

export function detectManipulation(klines) {
    const manipulationPoints = [];
    
    for (let i = 2; i < klines.length - 2; i++) {
        // Look for stop hunts: Quick spike followed by reversal
        const isStopHunt = (
            Math.abs(klines[i].high - klines[i].low) > 
            2 * Math.abs(klines[i-1].high - klines[i-1].low) &&
            Math.abs(klines[i+1].close - klines[i].close) < 
            Math.abs(klines[i].high - klines[i].low) * 0.3
        );
        
        if (isStopHunt) {
            manipulationPoints.push({
                index: i,
                type: 'stopHunt',
                price: klines[i].close
            });
        }
    }
    
    return manipulationPoints;
}