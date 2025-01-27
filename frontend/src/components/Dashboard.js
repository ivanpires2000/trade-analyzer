import React, { useState } from 'react';
import PerformanceStats from './PerformanceStats';
import StrategySelector from './StrategySelector';
import ScenarioSimulator from './ScenarioSimulator';
import './Dashboard.css';

const Dashboard = () => {
    const [selectedAsset, setSelectedAsset] = useState('');
    const [selectedAssetType, setSelectedAssetType] = useState('crypto');
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAssetSelect = (asset, assetType) => {
        setSelectedAsset(asset);
        setSelectedAssetType(assetType);
    };

    const handleAnalysisResult = (result) => {
        setAnalysisResult(result);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Análise de Mercado</h1>
            </div>

            <div className="dashboard-content">
                <div className="main-panel">
                    <StrategySelector 
                        onAssetSelect={handleAssetSelect}
                        onAnalysisResult={handleAnalysisResult}
                    />
                    
                    {selectedAsset && (
                        <PerformanceStats 
                            asset={selectedAsset}
                            assetType={selectedAssetType}
                        />
                    )}
                    
                    <ScenarioSimulator 
                        asset={selectedAsset}
                        assetType={selectedAssetType}
                        analysisResult={analysisResult}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 