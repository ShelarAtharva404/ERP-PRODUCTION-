const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/erp_system_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Clear old users if needed (optional)
    // await User.deleteMany({});

    // Create users
    await User.create([
      {
        fullname: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        fullname: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
      },
      {
        fullname: 'Developer User',
        email: 'developer@example.com',
        password: 'dev123',
        role: 'developer',
      },
    ]);

    console.log('Test users created:');
    console.log('Admin    -> admin@example.com / admin123');
    console.log('Manager  -> manager@example.com / manager123');
    console.log('Developer-> developer@example.com / dev123');

    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
