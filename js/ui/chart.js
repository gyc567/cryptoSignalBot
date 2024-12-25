import { Chart } from 'chart.js/auto';

let chartInstance = null;

export function initializeChart() {
    // If there's an existing chart, destroy it
    if (chartInstance) {
        chartInstance.destroy();
    }

    const chartCanvas = document.getElementById('priceChart');
    if (!chartCanvas) return null;
    
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return null;

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '价格',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    return chartInstance;
}

export function updateChart(chart, klines, symbol) {
    if (!chart) return;
    
    chart.data.labels = klines.map(k => new Date(k.timestamp).toLocaleTimeString());
    chart.data.datasets[0].data = klines.map(k => k.close);
    chart.data.datasets[0].label = `${symbol} 价格`;
    chart.update();
}