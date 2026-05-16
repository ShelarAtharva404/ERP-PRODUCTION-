const User = require('../models/User');

// GET all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /profile - Get own profile (token-based)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /:id - Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullname = req.body.fullname || user.fullname;
    user.email = req.body.email || user.email;
    if (req.body.role) {
      // Optionally validate role here (e.g. ['admin','manager','developer'].includes(req.body.role))
      user.role = req.body.role;
    }

    await user.save();

    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /:id - Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /profile - update own profile (token based)
exports.updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // token se user id mil rahi hai
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullname = req.body.fullname || user.fullname;
    user.email = req.body.email || user.email;
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
