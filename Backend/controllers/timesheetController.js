// backend/controllers/timesheetController.js

const Timesheet = require('../models/Timesheet');

// POST /timesheet - Add a timesheet entry
exports.addTimesheet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, tasks, hoursWorked } = req.body;  // match model fields

    // Create new timesheet record
    const timesheetEntry = new Timesheet({
      user: userId,
      date,
      tasks,
      hoursWorked,
      status: "pending" // Always set to pending on submit
    });

    await timesheetEntry.save();

    res.status(201).json({ message: 'Timesheet entry added', timesheetEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /timesheet/:userId - Get all timesheet entries for a user
exports.getTimesheets = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find timesheets sorted by date descending
    const timesheets = await Timesheet.find({ user: userId }).sort({ date: -1 });

    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bonus: GET /timesheet/weekly-summary/:userId - Get weekly summary of timesheets
exports.getWeeklySummary = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Aggregate timesheets by week (grouped by year and week number)
    const summary = await Timesheet.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, week: { $week: "$date" } },
          totalHours: { $sum: "$hoursWorked" }, // <-- FIXED FIELD NAME
          tasks: { $push: "$tasks" } // <-- FIXED FIELD NAME
        }
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all timesheets (admin/manager)
exports.getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find().populate({
      path: 'user',
      select: 'fullname email',
      strictPopulate: false
    });

    const validTimesheets = timesheets.filter(ts => ts.user && ts.user.fullname);

    res.json(validTimesheets);
  } catch (err) {
    console.error("Error in getAllTimesheets:", err.stack || err.message);
    res.status(500).json({ message: err.message });
  }
};

// Assign task to developer
exports.assignTask = async (req, res) => {
  try {
    const { assignedTo, taskTitle, dueDate } = req.body;
    const timesheet = new Timesheet({
      user: assignedTo,
      date: new Date(),
      tasks: taskTitle,
      hoursWorked: 0,
      status: 'assigned',
      assignedBy: req.user.id,
      dueDate: dueDate ? new Date(dueDate) : undefined
      // file: req.file?.path // For file upload, if implemented
    });
    await timesheet.save();
    res.status(201).json({ message: 'Task assigned', timesheet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get assigned tasks for a developer
exports.getAssignedTasks = async (req, res) => {
  try {
    const devId = req.params.devId;
    const tasks = await Timesheet.find({ user: devId }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /timesheet/my - Get own timesheets (developer)
exports.getMyTimesheets = async (req, res) => {
  try {
    const userId = req.user.id;
    const timesheets = await Timesheet.find({ user: userId }).sort({ date: -1 });
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /timesheet/:id - Approve or reject timesheet (admin/manager)
exports.updateTimesheetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) return res.status(404).json({ message: "Timesheet not found" });
    timesheet.status = status;
    await timesheet.save();
    res.json({ message: `Timesheet ${status}`, timesheet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /timesheet/:id - Delete a timesheet (admin/manager)
exports.deleteTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndDelete(req.params.id);
    if (!timesheet) return res.status(404).json({ message: "Timesheet not found" });
    res.json({ message: "Timesheet deleted", timesheet });
  } catch (err) {
    res.status(500).json({ message: err.message }); // <-- fixed here
  }
};
