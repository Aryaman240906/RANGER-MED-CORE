// backend/src/routes/prediction.routes.js
const express = require('express');
const { light, full } = require('../controllers/prediction.controller');
const { protect } = require('../middleware/auth.middleware'); // optional protect

const router = express.Router();

router.post('/light', protect, light);  // protected: only logged-in users
router.post('/full', protect, full);

module.exports = router;
