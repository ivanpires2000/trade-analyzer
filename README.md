# Trade Analyzer

## Sobre o Projeto

Trade Analyzer é uma aplicação web que permite aos usuários analisar e simular cenários de trading. Esta ferramenta é projetada para ajudar traders a tomar decisões mais informadas, oferecendo simulações baseadas em dados históricos e parâmetros personalizáveis.

## Funcionalidades Principais

- Simulação de cenários de trading
- Análise de ativos
- Visualização de resultados de simulação
- Configurações avançadas para simulações personalizadas

## Tecnologias Utilizadas

- Frontend: React.js
- Backend: Node.js com Express
- Banco de Dados: MongoDB (via Mongoose)
- Análise de Dados: Python (scikit-learn, pandas, numpy)

## Como Iniciar a Aplicação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente vem com Node.js)
- Python 3.7 ou superior
- MongoDB

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/trade-analyzer.git
   cd trade-analyzer
   ```

2. Instale as dependências:
   ```
   npm run install-all
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e na pasta `backend` com as seguintes variáveis:
   ```
   MONGODB_URI=sua_uri_do_mongodb
   JWT_SECRET=seu_segredo_jwt
   ```

4. Instale as dependências Python:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Executando a Aplicação

1. Na raiz do projeto, inicie a aplicação:
   ```
   npm start
   ```

   Isso iniciará tanto o servidor backend quanto o frontend.

2. Acesse a aplicação em seu navegador:
   [http://localhost:3000](http://localhost:3000)

## Uso

1. Registre-se ou faça login na aplicação.
2. Selecione um ativo para análise.
3. Configure os parâmetros de simulação (saldo inicial, stop loss, take profit, etc.).
4. Execute a simulação e analise os resultados.

## Contribuindo

Contribuições são bem-vindas! Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md para detalhes.

## Contato

Seu Nome - seu-email@exemplo.com

Link do Projeto: [https://github.com/ivanpires2000/trade-analyzer](https://github.com/ivanpires2000/trade-analyzer)
```

Este README fornece uma visão geral do projeto, explica como configurar e iniciar a aplicação, e oferece informações básicas sobre seu uso. Você pode ajustar os detalhes conforme necessário, especialmente as informações de contato e os links do repositório.

Lembre-se de criar os arquivos mencionados (CONTRIBUTING.md e LICENSE.md) se eles ainda não existirem em seu projeto. Além disso, certifique-se de que as instruções de instalação e execução estão precisas e funcionam corretamente em seu ambiente de desenvolvimento.