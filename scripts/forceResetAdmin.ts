import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from the root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const resetAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in the environment variables.');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Mongoose schema just for resetting password
    const userSchema = new mongoose.Schema({
        username: String,
        password: String
    }, { strict: false });

    const User = mongoose.model('User', userSchema);

    // Find the admin user
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
        console.log('Admin user not found, please start the server first to trigger the initial seed!');
        process.exit(1);
    }

    // Set the password back to admin123
    console.log('Admin user found. Resetting password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log('\n--- SUCCESS ---');
    console.log('The admin password was successfully forcefully reset.');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    process.exit(0);

  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();
