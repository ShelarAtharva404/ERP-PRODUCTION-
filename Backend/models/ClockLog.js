const mongoose = require('mongoose');

const clockLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ClockLog', clockLogSchema);
