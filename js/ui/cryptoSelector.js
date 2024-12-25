import { fetch8HourKlines } from '../services/binanceService.js';
import { generateTradingSignal } from '../services/signalService.js';
import { validateSymbol } from '../utils/validation.js';
import { initializeChart, updateChart } from './chart.js';

export function initializeCryptoSelector() {
    const cryptoSelect = document.getElementById('cryptoSelect');
    const customInputContainer = document.getElementById('customInputContainer');
    const customSymbol = document.getElementById('customSymbol');
    const calculateButton = document.getElementById('calculateSignal');

    if (!cryptoSelect || !calculateButton) return;

    const chart = initializeChart();

    // Handle custom input visibility
    if (customInputContainer && customSymbol) {
        cryptoSelect.addEventListener('change', () => {
            if (cryptoSelect.value === 'custom') {
                customInputContainer.classList.remove('hidden');
                customSymbol.focus();
            } else {
                customInputContainer.classList.add('hidden');
            }
        });
    }

    // Handle signal calculation
    calculateButton.addEventListener('click', async () => {
        try {
            let selectedSymbol = cryptoSelect.value;
            if (selectedSymbol === 'custom' && customSymbol) {
                selectedSymbol = customSymbol.value.trim().toUpperCase();
                if (!validateSymbol(selectedSymbol)) {
                    throw new Error('无效的代币符号');
                }
            }

            const klines = await fetch8HourKlines(selectedSymbol);
            const signal = generateTradingSignal(klines);

            updateUI(signal);
            if (chart) {
                updateChart(chart, klines, selectedSymbol);
            }

        } catch (error) {
            console.error('Error generating signal:', error);
            alert(error.message === '无效的代币符号' ? error.message : '获取数据失败，请稍后重试');
        }
    });
}

function updateUI(signal) {
    const elements = {
        entryPoint: document.getElementById('entryPoint'),
        stopLoss: document.getElementById('stopLoss'),
        takeProfit: document.getElementById('takeProfit'),
        signalResult: document.getElementById('signalResult')
    };

    if (elements.entryPoint) elements.entryPoint.textContent = signal.entryPoint.toFixed(2);
    if (elements.stopLoss) elements.stopLoss.textContent = signal.stopLoss.toFixed(2);
    if (elements.takeProfit) elements.takeProfit.textContent = signal.takeProfit.toFixed(2);
    if (elements.signalResult) elements.signalResult.classList.remove('hidden');
}