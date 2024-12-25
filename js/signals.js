// 模拟8小时K线数据
function generateKlineData() {
    const klines = [];
    const basePrice = 40000 + Math.random() * 10000;
    
    for (let i = 0; i < 30; i++) {
        const open = i === 0 ? basePrice : klines[i-1].close;
        const close = open * (1 + (Math.random() - 0.5) * 0.02);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const volume = Math.random() * 1000;
        
        klines.push({
            timestamp: Date.now() - (29-i) * 8 * 60 * 60 * 1000,
            open,
            high,
            low,
            close,
            volume
        });
    }
    
    return klines;
}

// 计算技术指标
function calculateIndicators(klines) {
    // 计算MA
    const ma20 = calculateMA(klines, 20);
    // 计算RSI
    const rsi = calculateRSI(klines, 14);
    // 计算MACD
    const macd = calculateMACD(klines);
    
    return { ma20, rsi, macd };
}

function calculateMA(klines, period) {
    const closes = klines.map(k => k.close);
    const ma = [];
    
    for (let i = period - 1; i < closes.length; i++) {
        const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / period);
    }
    
    return ma;
}

function calculateRSI(klines, period) {
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

function calculateMACD(klines) {
    const closes = klines.map(k => k.close);
    const ema12 = <boltAction type="file" filePath="js/signals.js">    calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    
    return {
        macdLine,
        signalLine,
        histogram: macdLine.map((v, i) => v - signalLine[i])
    };
}

function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const ema = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
        ema.push(data[i] * k + ema[i-1] * (1-k));
    }
    
    return ema;
}

// 生成交易信号
function generateTradingSignal(klines) {
    const indicators = calculateIndicators(klines);
    const lastPrice = klines[klines.length - 1].close;
    const lastVolume = klines[klines.length - 1].volume;
    
    // 使用多个技术指标综合分析
    const rsiSignal = indicators.rsi > 70 ? 'sell' : indicators.rsi < 30 ? 'buy' : 'neutral';
    const macdSignal = indicators.macd.histogram[indicators.macd.histogram.length - 1] > 0 ? 'buy' : 'sell';
    const maSignal = lastPrice > indicators.ma20[indicators.ma20.length - 1] ? 'buy' : 'sell';
    
    // 计算建议的入场点、止损点和目标价
    let signal = {
        type: 'neutral',
        entryPoint: lastPrice,
        stopLoss: lastPrice * 0.95,
        takeProfit: lastPrice * 1.05,
        confidence: 0,
        reasoning: []
    };
    
    // 综合分析各个指标
    let signalPoints = 0;
    
    if (rsiSignal === 'buy') {
        signalPoints += 1;
        signal.reasoning.push('RSI显示超卖');
    } else if (rsiSignal === 'sell') {
        signalPoints -= 1;
        signal.reasoning.push('RSI显示超买');
    }
    
    if (macdSignal === 'buy') {
        signalPoints += 1;
        signal.reasoning.push('MACD显示上升趋势');
    } else {
        signalPoints -= 1;
        signal.reasoning.push('MACD显示下降趋势');
    }
    
    if (maSignal === 'buy') {
        signalPoints += 1;
        signal.reasoning.push('价格位于MA20上方');
    } else {
        signalPoints -= 1;
        signal.reasoning.push('价格位于MA20下方');
    }
    
    // 根据综合得分确定信号类型
    if (signalPoints >= 2) {
        signal.type = 'buy';
        signal.entryPoint = lastPrice;
        signal.stopLoss = lastPrice * 0.95;
        signal.takeProfit = lastPrice * 1.08;
        signal.confidence = Math.min(Math.abs(signalPoints) * 25, 90);
    } else if (signalPoints <= -2) {
        signal.type = 'sell';
        signal.entryPoint = lastPrice;
        signal.stopLoss = lastPrice * 1.05;
        signal.takeProfit = lastPrice * 0.92;
        signal.confidence = Math.min(Math.abs(signalPoints) * 25, 90);
    }
    
    return signal;
}

// 导出函数
export { generateKlineData, generateTradingSignal };