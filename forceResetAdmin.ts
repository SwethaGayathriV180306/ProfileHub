import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const resetAdmin = async () => {
  try {
    const mongoUri = 'mongodb://127.0.0.1:27017/profilehub';
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const userSchema = new mongoose.Schema({
        username: String,
        password: String
    }, { strict: false });

    // Try to get model, or create it
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Find the admin user
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
        console.log('Admin user not found, creating one forcefully...');
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
    } else {
        console.log('Admin user found. Resetting password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        adminUser.password = hashedPassword;
        await adminUser.save();
    }

    console.log('\n--- SUCCESS ---');
    console.log('The admin password was successfully set.');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    process.exit(0);

  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();
