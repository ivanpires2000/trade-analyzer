// frontend/src/components/TradeAnalyzer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TradeAnalyzer = () => {
    const [data, setData] = useState([]);
    const [asset, setAsset] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (symbol) => {
        if (!symbol) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.get(`/api/data?asset=${symbol}`);
            setData(response.data);
        } catch (err) {
            console.error('Erro:', err);
            setError(err.response?.data?.error || 'Erro ao carregar dados');
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (asset.length >= 3) {
            const timeoutId = setTimeout(() => {
                fetchData(asset);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [asset]);

    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: `${asset.toUpperCase()} Price`,
                data: data.map(item => item.price),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Análise do Ativo: ${asset.toUpperCase()}`
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    return (
        <div className="trade-analyzer">
            <div className="input-container">
                <input 
                    type="text" 
                    value={asset} 
                    onChange={(e) => setAsset(e.target.value.toUpperCase())} 
                    placeholder="Digite o símbolo do ativo (ex: BTC)" 
                    className="asset-input"
                />
                {isLoading && <div className="loading">Carregando...</div>}
                {error && <div className="error">{error}</div>}
            </div>
            
            {data.length > 0 && (
                <div className="chart-container" style={{ minHeight: '500px' }}>
                    <Line data={chartData} options={options} />
                    <div className="stats">
                        <div>Preço Atual: ${data[data.length - 1].price.toFixed(2)}</div>
                        <div>Variação: {((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2)}%</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradeAnalyzer;