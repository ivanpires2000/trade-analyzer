// backend/services/modelService.js
const joblib = require('joblib');

const loadModel = async () => {
    const model = await joblib.load('path/to/your/model.pkl');
    return model;
};

const predict = async (inputData) => {
    const model = await loadModel();
    const prediction = model.predict(inputData);
    return prediction;
};

module.exports = { predict };