const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all timesheets (admin/manager) - PLACE THIS ROUTE BEFORE ANY :userId ROUTE
router.get('/all', verifyToken, authorizeRoles('admin', 'manager'), timesheetController.getAllTimesheets);

// Developer: submit timesheet
router.post('/', verifyToken, authorizeRoles('developer'), timesheetController.addTimesheet);

// Developer: get own timesheets
router.get('/my', verifyToken, authorizeRoles('developer'), timesheetController.getMyTimesheets);

// Weekly summary for a user
router.get('/weekly-summary/:userId', verifyToken, timesheetController.getWeeklySummary);

// Get assigned tasks for a developer
router.get('/assigned/:devId', verifyToken, authorizeRoles('manager'), timesheetController.getAssignedTasks);

// Assign task to developer (with dueDate and file upload support in future)
router.post('/assign', verifyToken, authorizeRoles('manager'), timesheetController.assignTask);

// Get timesheets for a user (admin/manager/dev)
router.get('/:userId', verifyToken, timesheetController.getTimesheets);

// Approve/reject timesheet (admin/manager)
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), timesheetController.updateTimesheetStatus);

// Delete a timesheet (admin/manager)
router.delete('/:id', verifyToken, authorizeRoles('admin', 'manager'), timesheetController.deleteTimesheet);

module.exports = router;
