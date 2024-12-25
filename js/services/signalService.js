import { calculateMA, calculateRSI, calculateMACD } from '../utils/indicators.js';
import { findLiquidity, findOrderBlocks, detectManipulation } from '../utils/smc.js';

function calculateIndicators(klines) {
    return {
        ma20: calculateMA(klines, 20),
        rsi: calculateRSI(klines, 14),
        macd: calculateMACD(klines),
        smc: {
            liquidity: findLiquidity(klines),
            orderBlocks: findOrderBlocks(klines),
            manipulation: detectManipulation(klines)
        }
    };
}

export function generateTradingSignal(klines) {
    const indicators = calculateIndicators(klines);
    const lastPrice = klines[klines.length - 1].close;
    const lastVolume = klines[klines.length - 1].volume;
    
    // SMC Analysis
    const { liquidity, orderBlocks, manipulation } = indicators.smc;
    const nearestSupport = liquidity.lows
        .filter(level => level.price < lastPrice)
        .sort((a, b) => b.price - a.price)[0];
    const nearestResistance = liquidity.highs
        .filter(level => level.price > lastPrice)
        .sort((a, b) => a.price - b.price)[0];
    
    // Signal generation with SMC
    let signal = {
        type: 'neutral',
        entryPoint: lastPrice,
        stopLoss: lastPrice * 0.95,
        takeProfit: lastPrice * 1.05,
        confidence: 0,
        reasoning: []
    };
    
    let signalPoints = 0;
    
    // 1. Order Block Analysis
    const recentBullishOB = orderBlocks.bullishOB.slice(-3);
    const recentBearishOB = orderBlocks.bearishOB.slice(-3);
    
    if (recentBullishOB.length > 0 && lastPrice > recentBullishOB[0].low) {
        signalPoints += 2;
        signal.reasoning.push('价格在看涨订单区上方');
    } else if (recentBearishOB.length > 0 && lastPrice < recentBearishOB[0].high) {
        signalPoints -= 2;
        signal.reasoning.push('价格在看跌订单区下方');
    }
    
    // 2. Liquidity Analysis
    if (nearestSupport && (lastPrice - nearestSupport.price) / lastPrice < 0.02) {
        signalPoints += 1;
        signal.reasoning.push('价格接近主要支撑位');
    }
    if (nearestResistance && (nearestResistance.price - lastPrice) / lastPrice < 0.02) {
        signalPoints -= 1;
        signal.reasoning.push('价格接近主要阻力位');
    }
    
    // 3. Manipulation Detection
    const recentManipulation = manipulation.slice(-2);
    if (recentManipulation.length > 0) {
        if (lastPrice > recentManipulation[0].price) {
            signalPoints += 1;
            signal.reasoning.push('价格突破止损猎杀点位');
        } else {
            signalPoints -= 1;
            signal.reasoning.push('价格在止损猎杀点位下方');
        }
    }
    
    // 4. Traditional Indicators as Confirmation
    if (indicators.rsi < 30) {
        signalPoints += 1;
        signal.reasoning.push('RSI显示超卖');
    } else if (indicators.rsi > 70) {
        signalPoints -= 1;
        signal.reasoning.push('RSI显示超买');
    }
    
    if (indicators.macd.histogram[indicators.macd.histogram.length - 1] > 0) {
        signalPoints += 1;
        signal.reasoning.push('MACD显示上升趋势');
    } else {
        signalPoints -= 1;
        signal.reasoning.push('MACD显示下降趋势');
    }
    
    // Generate final signal with dynamic stop loss and take profit
    if (signalPoints >= 2) {
        signal.type = 'buy';
        signal.stopLoss = nearestSupport ? 
            Math.min(nearestSupport.price * 0.99, lastPrice * 0.95) : 
            lastPrice * 0.95;
        signal.takeProfit = nearestResistance ? 
            Math.max(nearestResistance.price, lastPrice * 1.08) : 
            lastPrice * 1.08;
        signal.confidence = Math.min(Math.abs(signalPoints) * 15, 90);
    } else if (signalPoints <= -2) {
        signal.type = 'sell';
        signal.stopLoss = nearestResistance ? 
            Math.max(nearestResistance.price * 1.01, lastPrice * 1.05) : 
            lastPrice * 1.05;
        signal.takeProfit = nearestSupport ? 
            Math.min(nearestSupport.price, lastPrice * 0.92) : 
            lastPrice * 0.92;
        signal.confidence = Math.min(Math.abs(signalPoints) * 15, 90);
    }
    
    return signal;
}