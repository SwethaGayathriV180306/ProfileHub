
import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-dashboard');
    const users = await User.find({});
    console.log('Users found:', users.length);
    users.forEach(u => console.log(`- ${u.username} (${u.email}) ID: ${u._id}`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
