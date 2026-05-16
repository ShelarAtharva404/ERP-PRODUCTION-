const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeIn: { type: Date, required: true },
  clockOut: { type: Date } // Added for clock out
}, { timestamps: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
