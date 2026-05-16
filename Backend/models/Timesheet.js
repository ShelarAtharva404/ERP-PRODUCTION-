const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: null },
  date: { type: Date, required: true },
  hoursWorked: { type: Number, required: true },
  tasks: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'assigned'], default: 'pending' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Manager who assigned
  dueDate: { type: Date }, // Optional due date for task
  file: { type: String } // File upload path or URL
}, { timestamps: true });

module.exports = mongoose.model('Timesheet', timesheetSchema);
