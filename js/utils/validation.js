export function validateSymbol(symbol) {
    // Basic validation for cryptocurrency trading pair
    if (!symbol) return false;
    
    // Must be uppercase letters or numbers
    if (!/^[A-Z0-9]+$/.test(symbol)) return false;
    
    // Must end with USDT, BTC, ETH, or BNB
    if (!/(?:USDT|BTC|ETH|BNB)$/.test(symbol)) return false;
    
    // Length check (most trading pairs are between 5 and 12 characters)
    if (symbol.length < 5 || symbol.length > 12) return false;
    
    return true;
}