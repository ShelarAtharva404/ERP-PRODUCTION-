// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Define the routes here
router.post('/clockin', verifyToken, attendanceController.clockIn);
router.post('/clockout', verifyToken, attendanceController.clockOut);
router.get('/all', verifyToken, authorizeRoles('admin', 'manager'), attendanceController.getAll);
router.get('/my', verifyToken, attendanceController.getMyAttendance);

// Export the router only
module.exports = router;
