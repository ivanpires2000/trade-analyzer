// frontend/src/components/PerformanceChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceChart = ({ data = [] }) => {
    // Verifica se os dados são válidos
    const validData = Array.isArray(data) && data.length > 0;

    if (!validData) {
        return (
            <div className="empty-chart">
                <p>Nenhum dado de performance disponível</p>
            </div>
        );
    }

    const chartData = {
        labels: data.map(item => item.name || ''),
        datasets: [
            {
                label: 'Performance (%)',
                data: data.map(item => Number(item.value) || 0),
                fill: {
                    target: 'origin',
                    above: 'rgba(76, 175, 80, 0.1)',   // Área acima da linha
                    below: 'rgba(255, 0, 0, 0.1)'      // Área abaixo da linha
                },
                borderColor: '#4CAF50',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4CAF50',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#4CAF50',
                pointHoverBorderColor: '#fff'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            filler: {
                propagate: true
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#666',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4CAF50',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `Performance: ${context.parsed.y.toFixed(2)}%`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#666'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#666',
                    callback: (value) => `${value.toFixed(1)}%`
                }
            }
        }
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PerformanceChart;