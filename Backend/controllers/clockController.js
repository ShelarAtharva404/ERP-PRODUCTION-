const ClockLog = require('../models/ClockLog');

// POST /clockin - Clock In user
exports.clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingLog = await ClockLog.findOne({ user: userId, clockOut: null });
    if (existingLog) {
      return res.status(400).json({ message: 'Already clocked in, please clock out before clocking in again' });
    }
    const clockInLog = new ClockLog({ user: userId, clockIn: new Date(), clockOut: null });
    await clockInLog.save();
    res.status(201).json({ message: 'Clocked in successfully', clockInLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /clockout - Clock Out user
exports.clockOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow },
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No clock-in found for today' });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ message: 'Already clocked out today' });
    }

    attendance.clockOut = new Date();
    await attendance.save();
    res.json({ message: 'Clocked out', attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ ADD THIS FUNCTION:
exports.getClockLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await ClockLog.find({ user: userId });
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
