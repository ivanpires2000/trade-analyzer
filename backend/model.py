import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPRegressor

# Carregar dados históricos
data = pd.read_csv('historical_data.csv')
X = data[['feature1', 'feature2']]  # Substitua por suas características
y = data['target']  # Preço futuro

# Dividir os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Treinar o modelo de regressão linear
linear_model = LinearRegression()
linear_model.fit(X_train, y_train)

# Treinar o modelo de rede neural
nn_model = MLPRegressor(hidden_layer_sizes=(50, 50), max_iter=1000)
nn_model.fit(X_train, y_train)

# Fazer previsões
linear_predictions = linear_model.predict(X_test)
nn_predictions = nn_model.predict(X_test)

# Exibir previsões
print('Linear Regression Predictions:', linear_predictions)
print('Neural Network Predictions:', nn_predictions) 