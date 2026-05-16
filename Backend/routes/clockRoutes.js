const express = require('express');
const router = express.Router();
const clockController = require('../controllers/clockController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/clockin', verifyToken, clockController.clockIn);
router.post('/clockout', verifyToken, clockController.clockOut);
router.get('/logs', verifyToken, clockController.getClockLogs);

module.exports = router;
