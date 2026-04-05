import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AuditLog from '../models/AuditLog';
import { sendEmail } from '../utils/email';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('Registering user:', req.body.email);
    const { name, email, password, role, username, department, year, semester, gender, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    if (email && !email.endsWith('@bitsathy.ac.in')) {
      res.status(400).json({ message: 'Only @bitsathy.ac.in emails are allowed' });
      return;
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log('Username already exists:', username);
      res.status(400).json({ message: 'Roll Number already registered' });
      return;
    }

    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      username,
      rollNumber: username, // Set rollNumber same as username
      department,
      year,
      semester,
      gender,
      phone // Save phone correctly
    });

    if (user) {
      console.log('User created:', user._id);
      try {
        console.log('Creating audit log...');
        await AuditLog.create({
          action: 'USER_REGISTER',
          performedBy: user._id,
          details: `User registered: ${user.email}`,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });
        console.log('Audit log created');
      } catch (auditError) {
        console.error('Audit log creation failed (non-fatal):', auditError);
        // Continue even if audit log fails
      }

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: true
        },
        token: generateToken(user._id.toString()),
      });
    } else {
      console.log('User creation failed (no user returned)');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server Error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Allow login with either email or username (Roll Number)
  const identifier = email || username;
  
  if (!identifier) {
    res.status(400).json({ message: 'Please provide email or username' });
    return;
  }

  const user = await User.findOne({ 
    $or: [{ email: identifier }, { username: identifier }] 
  });

  if (user && user.accountLockedUntil && user.accountLockedUntil > new Date()) {
    res.status(403).json({ message: 'Account is locked. Try again later.' });
    return;
  }

  if (user && (await bcrypt.compare(password, user.password!))) {
    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      action: 'USER_LOGIN',
      performedBy: user._id,
      details: `User logged in: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: true
      },
      token: generateToken(user._id.toString()),
    });
  } else {
    if (user) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();
    }
    res.status(401).json({ message: 'Invalid email/username or password' });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // ... other fields
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (email.includes('@') && !email.endsWith('@bitsathy.ac.in')) {
    res.status(400).json({ message: 'Only @bitsathy.ac.in emails are allowed' });
    return;
  }

  const user = await User.findOne({ $or: [{ email }, { username: email }] });

  if (user) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: 'ProfileHub - Password Reset OTP',
        text: `Your OTP for resetting your ProfileHub password is ${otp}. It is valid for 5 minutes.`,
      });
      res.json({ message: 'OTP sent securely to your email.' }); 
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ 
    $or: [{ email }, { username: email }],
    resetPasswordOtp: otp,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP, or User not found' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById((req as any).user._id);

  if (user && (await bcrypt.compare(currentPassword, user.password!))) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    await AuditLog.create({
      action: 'PASSWORD_CHANGE',
      performedBy: user._id,
      details: 'User successfully changed password from settings',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid current password' });
  }
};
