const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// User: get/update own profile
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateOwnProfile);

// Admin/Manager: get all users
router.get('/', verifyToken, authorizeRoles('admin', 'manager'), userController.getAllUsers);
router.put('/:id', verifyToken, authorizeRoles('admin'), userController.updateUser);
router.delete('/:id', verifyToken, authorizeRoles('admin'), userController.deleteUser);


module.exports = router;
