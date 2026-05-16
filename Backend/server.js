require('dotenv').config(); // Load env variables from .env
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request body

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clock', require('./routes/clockRoutes'));
app.use('/api/timesheet', require('./routes/timesheetRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes')); // <-- Add if not present

// Error Handling Middleware (optional, you can add your own or extend)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Default Route
app.get('/', (req, res) => {
  res.send('ERP System API is running...');
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
