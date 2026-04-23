// backend/seedAdmin.js
// Run ONCE from inside the backend/ folder:  node seedAdmin.js
// Creates the admin account. Delete this file afterwards.

require('dotenv').config();
const connectDB = require('./config/db');
const User      = require('./models/User');

connectDB().then(async () => {
  const exists = await User.findOne({ email: 'admin@gmail.com' });
  if (exists) {
    console.log('Admin already exists — no changes made.');
    process.exit();
  }
  await User.create({
    name: 'ML Portfolio Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin created!');
  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123');
  console.log('⚠️  Delete seedAdmin.js now — you only need it once.');
  process.exit();
});