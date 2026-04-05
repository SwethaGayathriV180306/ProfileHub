import User from '../models/User';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Administrator',
      email: 'admin@bitsathy.ac.in',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      phone: '0000000000',
      department: 'ADMIN',
      year: 'N/A',
      semester: 'N/A',
      gender: 'Other'
    });

    console.log('Admin user created successfully: username=admin, password=admin123');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
