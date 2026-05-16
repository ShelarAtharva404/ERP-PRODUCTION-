const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const attendanceRoutes = require('./routes/attendanceRoutes');

router.post('/clockin', verifyToken, attendanceController.clockIn);
router.post('/clockout', verifyToken, attendanceController.clockOut);
router.get('/all', verifyToken, authorizeRoles('admin', 'manager'), attendanceController.getAll);
router.get('/my', verifyToken, attendanceController.getMyAttendance);

app.use('/api/attendance', attendanceRoutes);

module.exports = router;