import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PerformanceChart from './PerformanceChart';
import './PerformanceStats.css';

const PerformanceStats = ({ asset, assetType }) => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPerformanceData = async () => {
        try {
            if (!asset || !assetType) {
                setPerformanceData(null);
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/trade/performance', {
                params: {
                    asset,
                    assetType,
                    _t: Date.now() // Evita cache
                }
            });

            // Garante que os dados tenham a estrutura correta
            const data = response.data || {};
            setPerformanceData({
                dailyStats: data.dailyStats || [],
                successRate: data.successRate || 0,
                totalProfit: data.totalProfit || 0,
                recentTrades: data.recentTrades || []
            });
            setError(null);
        } catch (err) {
            console.error('Erro ao buscar dados de desempenho:', err);
            setError('Falha ao carregar dados de desempenho');
            setPerformanceData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformanceData();
        // Atualiza a cada 60 segundos
        const interval = setInterval(fetchPerformanceData, 60000);
        return () => clearInterval(interval);
    }, [asset, assetType]);

    if (loading) {
        return <div className="loading">Carregando dados de desempenho...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!performanceData) {
        return <div className="no-data">Nenhum dado de desempenho disponível</div>;
    }

    const { dailyStats = [], successRate = 0, totalProfit = 0, recentTrades = [] } = performanceData;

    return (
        <div className="performance-stats">
            <div className="stats-header">
                <div className="stat-box">
                    <h3>Taxa de Sucesso</h3>
                    <p className={successRate >= 50 ? 'positive' : 'negative'}>
                        {successRate.toFixed(2)}%
                    </p>
                </div>
                <div className="stat-box">
                    <h3>Lucro Total</h3>
                    <p className={totalProfit >= 0 ? 'positive' : 'negative'}>
                        {totalProfit.toFixed(2)}%
                    </p>
                </div>
            </div>

            <div className="chart-container">
                <h3>Desempenho ao Longo do Tempo</h3>
                <PerformanceChart data={dailyStats} />
            </div>

            <div className="recent-trades">
                <h3>Operações Recentes</h3>
                <div className="trades-list">
                    {recentTrades.length > 0 ? (
                        recentTrades.map((trade, index) => (
                            <div key={index} className="trade-item">
                                <span className="trade-date">
                                    {new Date(trade.date).toLocaleString()}
                                </span>
                                <span className={`trade-type ${trade.type?.toLowerCase()}`}>
                                    {trade.type || 'N/A'}
                                </span>
                                <span className="trade-price">
                                    R$ {trade.price?.toFixed(2) || '0.00'}
                                </span>
                                <span className={`trade-profit ${trade.profit >= 0 ? 'positive' : 'negative'}`}>
                                    {trade.profit?.toFixed(2) || '0.00'}%
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="no-trades">Nenhuma operação recente</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformanceStats; 