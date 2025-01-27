import React, { useState } from 'react';
import axios from 'axios';
import './StrategySelector.css';

const StrategySelector = ({ onAssetSelect, onAnalysisResult }) => {
    const [selectedStrategy, setSelectedStrategy] = useState('trendFollowing');
    const [asset, setAsset] = useState('');
    const [assetType, setAssetType] = useState('crypto');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const strategies = [
        { id: 'tassoLagoScalping', name: 'Scalping (Tasso Lago)', description: 'Operações rápidas baseadas em Price Action e Volume' },
        { id: 'tassoLagoTendencia', name: 'Seguidor de Tendência (Tasso Lago)', description: 'Identificação de tendências com foco em momentum' },
        { id: 'tassoLagoRompimento', name: 'Rompimento (Tasso Lago)', description: 'Operações em rompimentos de suporte e resistência com volume' },
        { id: 'carolPaifer', name: 'Price Action (Carol Paifer)', description: 'Análise de padrões gráficos e confluências de preço' },
        { id: 'thalitaMalago', name: 'Tape Reading (Thalita Malagó)', description: 'Leitura do fluxo de ordens e volume em tempo real' },
        { id: 'floMenezes', name: 'Momentum Trading (Flo Menezes)', description: 'Identificação de movimentos fortes no curto prazo' },
        { id: 'luizBarsi', name: 'Value Investing (Luiz Barsi)', description: 'Análise fundamentalista com foco em dividendos' },
        { id: 'trendFollowing', name: 'Trend Following (Bill Dunn)', description: 'Análise de tendências usando médias móveis' },
        { id: 'breakout', name: 'Breakout Strategy (Richard Dennis)', description: 'Identificação de rompimentos de suporte e resistência' },
        { id: 'swingTrading', name: 'Swing Trading (Linda Raschke)', description: 'Uso do RSI para identificar pontos de reversão' },
        { id: 'momentum', name: 'Momentum Trading (Paul Tudor Jones)', description: 'Identificação de força e direção do movimento de preços' },
        { id: 'meanReversion', name: 'Mean Reversion (James Simons)', description: 'Identificação de desvios extremos da média para reversão' },
        { id: 'volatilityBreakout', name: 'Volatility Breakout (Larry Williams)', description: 'Análise de rompimentos baseados na volatilidade' }
    ];

    // Lista de ações populares da B3
    const popularStocks = [
        'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3',
        'MGLU3', 'WEGE3', 'BBAS3', 'RENT3', 'RADL3'
    ];

    // Lista de criptomoedas populares
    const popularCryptos = [
        'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT',
        'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'AAVEUSDT'
    ];

    const handleAssetChange = (newAsset) => {
        setAsset(newAsset);
        onAssetSelect?.(newAsset, assetType);
    };

    const handleAssetTypeChange = (newType) => {
        setAssetType(newType);
        setAsset(''); // Limpa o ativo selecionado ao mudar o tipo
        onAssetSelect?.('', newType);
    };

    const handleAnalyze = async () => {
        if (!asset) {
            setError('Por favor, insira um ativo para análise');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Enviando requisição para análise:', asset);
            const response = await axios.post('/api/trade/analyze', {
                asset: asset.toUpperCase(),
                assetType,
                accountBalance: 10000,
                riskPercentage: 1,
            });

            if (response.data) {
                console.log('Resultado da análise:', response.data);
                onAnalysisResult?.(response.data);
            } else {
                setError('Resposta inválida do servidor');
            }
        } catch (err) {
            console.error('Erro na análise:', err);
            setError(
                err.response?.data?.message || 
                err.response?.data?.error || 
                'Erro ao analisar estratégia. Por favor, tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderAnalysisResult = () => {
        if (!analysisResult) return null;

        const commonMetrics = {
            signal: 'Sinal',
            indicator: 'Indicador'
        };

        const strategyMetrics = {
            tassoLagoScalping: {
                volumeProfile: 'Perfil de Volume',
                priceAction: 'Padrão de Price Action',
                volumeStrength: 'Força do Volume',
                timeAndTrade: 'Time & Trade'
            },
            tassoLagoTendencia: {
                trend: 'Tendência',
                momentum: 'Momentum',
                volumeConfirmation: 'Confirmação de Volume',
                pullback: 'Pullback'
            },
            tassoLagoRompimento: {
                breakoutLevel: 'Nível de Rompimento',
                volumeBreakout: 'Volume no Rompimento',
                priceAction: 'Price Action',
                consolidation: 'Consolidação'
            },
            carolPaifer: {
                trend: 'Tendência',
                volumeStrength: 'Força do Volume',
                priceChange: 'Variação de Preço (%)'
            },
            thalitaMalago: {
                volumeStrength: 'Força do Volume',
                volumeDelta: 'Delta do Volume'
            },
            floMenezes: {
                momentum: 'Momentum',
                velocity: 'Velocidade',
                volumeStrength: 'Força do Volume (%)'
            },
            luizBarsi: {
                priceDeviation: 'Desvio do Preço (%)',
                valueZone: 'Zona de Valor'
            },
            momentum: {
                velocity: 'Velocidade'
            },
            meanReversion: {
                deviation: 'Desvio da Média',
                reversionProbability: 'Probabilidade de Reversão'
            },
            volatilityBreakout: {
                currentVolatility: 'Volatilidade Atual',
                breakoutLevel: 'Nível de Breakout'
            }
        };

        const metrics = strategyMetrics[selectedStrategy] || commonMetrics;

        return (
            <div className="analysis-result">
                <h3>Resultado da Análise</h3>
                {Object.entries(metrics).map(([key, label]) => (
                    <p key={key}>
                        {label}: <strong>
                            {typeof analysisResult[key] === 'number' 
                                ? analysisResult[key].toFixed(2) + (key.includes('Percentage') || key.includes('priceChange') || key.includes('Deviation') ? '%' : '')
                                : analysisResult[key]}
                        </strong>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="strategy-selector">
            <h2>Seletor de Estratégias</h2>
            
            <div className="input-group">
                <label>Tipo de Ativo:</label>
                <select 
                    value={assetType} 
                    onChange={(e) => handleAssetTypeChange(e.target.value)}
                >
                    <option value="crypto">Criptomoedas</option>
                    <option value="stock">Ações B3</option>
                </select>
            </div>

            <div className="input-group">
                <label>Ativo:</label>
                <input
                    type="text"
                    value={asset}
                    onChange={(e) => handleAssetChange(e.target.value.toUpperCase())}
                    placeholder={assetType === 'crypto' ? 'Ex: BTCUSDT' : 'Ex: PETR4'}
                />
                <div className="popular-assets">
                    <p>Ativos Populares:</p>
                    <div className="asset-buttons">
                        {(assetType === 'crypto' ? popularCryptos : popularStocks).map(a => (
                            <button
                                key={a}
                                onClick={() => handleAssetChange(a)}
                                className={asset === a ? 'selected' : ''}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="input-group">
                <div className="strategy-select-container">
                    <select
                        value={selectedStrategy}
                        onChange={(e) => {
                            setSelectedStrategy(e.target.value);
                            setAnalysisResult(null);
                        }}
                        className="strategy-select"
                    >
                        {strategies.map(strategy => (
                            <option key={strategy.id} value={strategy.id}>
                                {strategy.name}
                            </option>
                        ))}
                    </select>
                    <p className="strategy-description">
                        {strategies.find(s => s.id === selectedStrategy)?.description}
                    </p>
                </div>

                <button 
                    onClick={handleAnalyze} 
                    disabled={loading || !asset}
                    className="analyze-button"
                >
                    {loading ? 'Analisando...' : 'Analisar Estratégia'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {renderAnalysisResult()}
        </div>
    );
};

export default StrategySelector; 