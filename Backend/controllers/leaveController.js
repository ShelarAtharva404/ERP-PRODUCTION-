// backend/controllers/leaveController.js

const LeaveRequest = require('../models/LeaveRequest');

// Employee submits leave
exports.requestLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const leaveRequest = new LeaveRequest({
      user: req.user.id,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: 'pending'
    });
    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request submitted', leaveRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: get all pending leaves
exports.getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'pending' })
      .populate('user', 'fullname email role'); // Ensure fullname is included
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: approve/reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await LeaveRequest.findById(req.params.leaveId);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = status;
    await leave.save();
    res.json({ message: `Leave ${status}`, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: get all approved leaves
exports.getApprovedLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'approved' })
      .populate('user', 'fullname email role'); // Ensure fullname is included
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Developer: get own leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'fullname email role'); // Optional: populate for consistency
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: get all leave requests (any status)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate('user', 'fullname email role')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
