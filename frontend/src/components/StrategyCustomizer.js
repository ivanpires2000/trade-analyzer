import React, { useState } from 'react';
import axios from 'axios';

const StrategyCustomizer = () => {
    const [strategy, setStrategy] = useState({ name: '', rules: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setStrategy({ ...strategy, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/customize-strategy', strategy);
            setMessage('Estratégia salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar estratégia:', error);
            setMessage('Erro ao salvar estratégia.');
        }
    };

    return (
        <div>
            <h2>Personalizar Estratégia</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={strategy.name}
                    onChange={handleChange}
                    placeholder="Nome da Estratégia"
                />
                <textarea
                    name="rules"
                    value={strategy.rules}
                    onChange={handleChange}
                    placeholder="Regras da Estratégia"
                    rows="4"
                    cols="50"
                />
                <button type="submit">Salvar Estratégia</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default StrategyCustomizer; 