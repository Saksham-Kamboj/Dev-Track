import User from '../models/User.js';

export const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      // console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@devtrack.com',
      password: 'Admin@123',
      role: 'admin'
    });

    await admin.save();
    console.log('Default admin user created:');
    console.log('Email: admin@devtrack.com');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
