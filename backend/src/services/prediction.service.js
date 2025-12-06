// backend/src/services/prediction.service.js
const axios = require('axios');
const { AI_SERVICE_URL } = require('../config/env');

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

exports.lightPredict = async (payload) => {
  const res = await aiClient.post('/api/ai/predict/light', payload);
  return res.data;
};

exports.fullPredict = async (payload) => {
  // returns immediate acknowledgement — real work runs in AI background
  const res = await aiClient.post('/api/ai/predict/full', payload);
  return res.data;
};
