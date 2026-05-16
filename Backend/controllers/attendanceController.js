const Attendance = require('../models/Attendance');

exports.clockIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find attendance for today using a date range
    const already = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });
    if (already) return res.status(400).json({ message: "Already clocked in today" });
    const attendance = new Attendance({ user: req.user.id, date: today, timeIn: new Date() });
    await attendance.save();
    res.status(201).json({ message: "Clocked in", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find attendance for today using a date range
    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });
    if (!attendance) return res.status(400).json({ message: "No clock-in found for today" });
    if (attendance.clockOut) return res.status(400).json({ message: "Already clocked out today" });
    attendance.clockOut = new Date();
    await attendance.save();
    res.json({ message: "Clocked out", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const records = await Attendance.find().populate('user', 'fullname email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('user', 'fullname email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
