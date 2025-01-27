import React, { useState } from 'react';
import { simulateScenario } from '../services/api';
import './ScenarioSimulator.css';

const ScenarioSimulator = ({ asset, assetType }) => {
    const [scenario, setScenario] = useState({
        initialBalance: 1000,
        stopLoss: 2,
        takeProfit: 4,
        positionSize: 100,
        leverage: 1
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [advanced, setAdvanced] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScenario(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!asset) {
                throw new Error('Selecione um ativo para simular');
            }

            // Validação dos campos
            if (!scenario.initialBalance || scenario.initialBalance <= 0) {
                throw new Error('Saldo inicial deve ser maior que zero');
            }
            if (!scenario.stopLoss || scenario.stopLoss <= 0) {
                throw new Error('Stop Loss deve ser maior que zero');
            }
            if (!scenario.takeProfit || scenario.takeProfit <= 0) {
                throw new Error('Take Profit deve ser maior que zero');
            }
            if (!scenario.positionSize || scenario.positionSize <= 0 || scenario.positionSize > 100) {
                throw new Error('Tamanho da posição deve estar entre 1% e 100%');
            }
            if (!scenario.leverage || scenario.leverage < 1) {
                throw new Error('Alavancagem deve ser maior ou igual a 1x');
            }

            const response = await simulateScenario(asset, assetType, scenario);
            setResult(response.result);
        } catch (err) {
            console.error('Erro na simulação:', err);
            setError(err.message || 'Erro ao executar simulação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scenario-simulator">
            <h2>Simulador de Cenários</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Saldo Inicial (R$):</label>
                    <input
                        type="number"
                        name="initialBalance"
                        value={scenario.initialBalance}
                        onChange={handleInputChange}
                        min="0"
                        step="100"
                        required
                    />
                    <span className="input-info">Saldo disponível para operações</span>
                </div>

                <div className="input-group">
                    <label>Stop Loss (%):</label>
                    <input
                        type="number"
                        name="stopLoss"
                        value={scenario.stopLoss}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        required
                    />
                    <span className="input-info">Limite de perda por operação</span>
                </div>

                <div className="input-group">
                    <label>Take Profit (%):</label>
                    <input
                        type="number"
                        name="takeProfit"
                        value={scenario.takeProfit}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        required
                    />
                    <span className="input-info">Objetivo de lucro por operação</span>
                </div>

                <button 
                    type="button" 
                    className="advanced-toggle"
                    onClick={() => setAdvanced(!advanced)}
                >
                    {advanced ? 'Ocultar Opções Avançadas' : 'Mostrar Opções Avançadas'}
                </button>

                {advanced && (
                    <>
                        <div className="input-group">
                            <label>Tamanho da Posição (%):</label>
                            <input
                                type="number"
                                name="positionSize"
                                value={scenario.positionSize}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                step="1"
                                required
                            />
                            <span className="input-info">Percentual do saldo por operação</span>
                        </div>

                        <div className="input-group">
                            <label>Alavancagem:</label>
                            <input
                                type="number"
                                name="leverage"
                                value={scenario.leverage}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                step="1"
                                required
                            />
                            <span className="input-info">Multiplicador de exposição</span>
                        </div>
                    </>
                )}

                <button type="submit" className="simulate-button" disabled={loading}>
                    {loading ? 'Simulando...' : 'Simular Operações'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {result && (
                <div className="simulation-results">
                    <h3>Resultados da Simulação</h3>
                    <div className="results-grid">
                        <div className="result-item">
                            <label>Saldo Final:</label>
                            <span className={result.profitLoss >= 0 ? 'positive' : 'negative'}>
                                R$ {result.finalBalance.toFixed(2)}
                            </span>
                        </div>
                        <div className="result-item">
                            <label>Lucro/Prejuízo:</label>
                            <span className={result.profitLoss >= 0 ? 'positive' : 'negative'}>
                                R$ {result.profitLoss.toFixed(2)} ({result.profitLossPercentage.toFixed(2)}%)
                            </span>
                        </div>
                        <div className="result-item">
                            <label>Total de Trades:</label>
                            <span>{result.totalTrades}</span>
                        </div>
                        <div className="result-item">
                            <label>Taxa de Sucesso:</label>
                            <span className={result.successRate >= 50 ? 'positive' : 'negative'}>
                                {result.successRate.toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    <div className="recent-trades">
                        <h4>Últimas Operações</h4>
                        <div className="trades-header">
                            <span>Tipo</span>
                            <span>Entrada</span>
                            <span>Saída</span>
                            <span>Resultado</span>
                            <span>Motivo</span>
                        </div>
                        {result.trades.map((trade, index) => (
                            <div key={index} className="trade-item">
                                <span className={`trade-type ${trade.type.toLowerCase()}`}>
                                    {trade.type}
                                </span>
                                <span>R$ {trade.entryPrice.toFixed(2)}</span>
                                <span>R$ {trade.exitPrice.toFixed(2)}</span>
                                <span className={trade.profit >= 0 ? 'positive' : 'negative'}>
                                    R$ {trade.profit.toFixed(2)}
                                </span>
                                <span className="exit-type">{trade.exitType}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScenarioSimulator; 