require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seed = async () => {
  await connectDB();

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

  console.log('✅ Admin created successfully');
  console.log('⚠️  Delete seedAdmin.js now — you only need it once.');
  process.exit();
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});