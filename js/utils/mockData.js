// Mock data generation utilities
export function generateKlineData() {
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