import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import './App.css';

const App = () => {
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Simular recebimento de notificação
        setTimeout(() => setNotification('O preço do ativo BTC está abaixo de 100'), 10000);
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Trade Analyzer</h1>
                {notification && <Notification message={notification} />}
            </header>
            
            <div className="app-content">
                <main className="main-panel">
                    <Dashboard />
                </main>
            </div>
        </div>
    );
};

export default App; 