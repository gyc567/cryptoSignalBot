// Binance API service
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export async function fetch8HourKlines(symbol = 'BTCUSDT', limit = 30) {
    try {
        const response = await fetch(
            `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=8h&limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch kline data');
        }
        
        const data = await response.json();
        
        return data.map(kline => ({
            timestamp: kline[0],
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5])
        }));
    } catch (error) {
        console.error('Error fetching kline data:', error);
        throw error;
    }
}