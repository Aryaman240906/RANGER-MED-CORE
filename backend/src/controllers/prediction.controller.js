// backend/src/controllers/prediction.controller.js
const predictionService = require('../services/prediction.service');
const asyncHandler = require('../middleware/async');

exports.light = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const aiRes = await predictionService.lightPredict(payload);
  res.status(200).json(aiRes);
});

exports.full = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const aiRes = await predictionService.fullPredict(payload);
  res.status(200).json(aiRes);
});
