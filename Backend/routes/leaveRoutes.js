const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Developer: submit leave
router.post('/', verifyToken, authorizeRoles('developer'), leaveController.requestLeave);

// Developer: view own leave requests
router.get('/my', verifyToken, authorizeRoles('developer'), leaveController.getMyLeaves);

// Admin/Manager: view/approve/reject leaves
router.get('/pending', verifyToken, authorizeRoles('admin', 'manager'), leaveController.getPendingLeaves);
router.get('/approved', verifyToken, authorizeRoles('admin', 'manager'), leaveController.getApprovedLeaves);
router.get('/all', verifyToken, authorizeRoles('admin', 'manager'), leaveController.getAllLeaves);
router.put('/:leaveId', verifyToken, authorizeRoles('admin', 'manager'), leaveController.updateLeaveStatus);

module.exports = router;
