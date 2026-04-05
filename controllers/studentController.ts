import { Request, Response } from 'express';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import Notification from '../models/Notification';

export const getStudentProfile = async (req: any, res: Response) => {
  const user = req.user;

  if (user) {
    // Map Mongoose document to StudentProfile interface
    const profile = user.toObject();
    
    // Ensure academic object exists and map root fields
    profile.academic = {
      cgpa: user.cgpa || 0,
      placementFaPercentage: user.academic?.placementFaPercentage || 0,
      arrearCount: user.academic?.arrearCount || 0,
      feesDue: user.academic?.feesDue || 0,
      history: user.academic?.history || []
    };
    profile.dob = user.dob;
    profile.modeOfAdmission = user.modeOfAdmission;
    profile.codingPlatformLinks = user.codingPlatformLinks || [];

    res.json(profile);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateStudentProfile = async (req: any, res: Response) => {
  const user = req.user;

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Personal Details
    user.rollNumber = req.body.rollNumber || user.rollNumber;
    user.about = req.body.about || user.about;
    user.dob = req.body.dob || user.dob;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.permanentAddress = req.body.permanentAddress || user.permanentAddress;
    user.currentAddress = req.body.currentAddress || user.currentAddress;
    user.parentName = req.body.parentName || user.parentName;
    user.parentContact = req.body.parentContact || user.parentContact;
    user.emergencyContact = req.body.emergencyContact || user.emergencyContact;
    user.linkedInUrl = req.body.linkedInUrl || user.linkedInUrl;
    user.githubUrl = req.body.githubUrl || user.githubUrl;
    user.portfolioUrl = req.body.portfolioUrl || user.portfolioUrl;
    user.codingPlatformLinks = req.body.codingPlatformLinks || user.codingPlatformLinks;
    user.dateOfAdmission = req.body.dateOfAdmission || user.dateOfAdmission;
    user.expectedGraduationYear = req.body.expectedGraduationYear || user.expectedGraduationYear;
    user.modeOfAdmission = req.body.modeOfAdmission || user.modeOfAdmission;

    // Academic Details
    user.tenthPercentage = req.body.tenthPercentage || user.tenthPercentage;
    user.tenthBoard = req.body.tenthBoard || user.tenthBoard;
    user.tenthYear = req.body.tenthYear || user.tenthYear;
    user.twelfthPercentage = req.body.twelfthPercentage || user.twelfthPercentage;
    user.twelfthBoard = req.body.twelfthBoard || user.twelfthBoard;
    user.twelfthYear = req.body.twelfthYear || user.twelfthYear;
    user.diplomaPercentage = req.body.diplomaPercentage || user.diplomaPercentage;
    user.diplomaBoard = req.body.diplomaBoard || user.diplomaBoard;
    user.diplomaYear = req.body.diplomaYear || user.diplomaYear;
    
    // Handle CGPA and Academic Object
    if (req.body.academic) {
      user.cgpa = req.body.academic.cgpa || user.cgpa;
      if (!user.academic) user.academic = {} as any;
      user.academic.placementFaPercentage = req.body.academic.placementFaPercentage || user.academic.placementFaPercentage;
      user.academic.arrearCount = req.body.academic.arrearCount || user.academic.arrearCount;
      user.academic.feesDue = req.body.academic.feesDue || user.academic.feesDue;
      user.academic.history = req.body.academic.history || user.academic.history;
    } else {
      user.cgpa = req.body.cgpa || user.cgpa;
    }

    user.backlogs = req.body.backlogs || user.backlogs;
    user.electives = req.body.electives || user.electives;
    user.specialization = req.body.specialization || user.specialization;
    user.scholarshipDetails = req.body.scholarshipDetails || user.scholarshipDetails;

    // Skills
    user.skills = req.body.skills || user.skills;
    
    // Education & Projects
    user.education = req.body.education || user.education;
    user.projects = req.body.projects || user.projects;

    // Settings
    if (req.body.settings) {
      if (!user.settings) user.settings = {};
      user.settings.twoFactorEnabled = req.body.settings.twoFactorEnabled !== undefined ? req.body.settings.twoFactorEnabled : user.settings.twoFactorEnabled;
      user.settings.notificationsEnabled = req.body.settings.notificationsEnabled !== undefined ? req.body.settings.notificationsEnabled : user.settings.notificationsEnabled;
    }

    // Calculate Profile Completeness
    let completeness = 0;
    
    // Profile Photo (20%)
    if (user.profilePhoto) completeness += 20;

    // Personal Info (20%) - Name, DOB, Gender, Blood Group, Phone
    let personalCount = 0;
    if (user.name) personalCount++;
    if (user.dob) personalCount++;
    if (user.gender) personalCount++;
    if (user.bloodGroup) personalCount++;
    if (user.phone) personalCount++;
    completeness += (personalCount / 5) * 20;

    // Contact Info (20%) - Permanent Address, Current Address, Parent Name, Parent Contact, Emergency Contact
    let contactCount = 0;
    if (user.permanentAddress) contactCount++;
    if (user.currentAddress) contactCount++;
    if (user.parentName) contactCount++;
    if (user.parentContact) contactCount++;
    if (user.emergencyContact) contactCount++;
    completeness += (contactCount / 5) * 20;

    // Academic Info (20%) - Admission Year, Expected Graduation Year, Mode of Admission, Scholarship Details
    let academicCount = 0;
    if (user.dateOfAdmission) academicCount++;
    if (user.expectedGraduationYear) academicCount++;
    if (user.modeOfAdmission) academicCount++;
    if (user.scholarshipDetails) academicCount++;
    completeness += (academicCount / 4) * 20;

    // Social Links (20%) - LinkedIn, GitHub, Portfolio, Coding Platforms
    let socialCount = 0;
    if (user.linkedInUrl) socialCount++;
    if (user.githubUrl) socialCount++;
    if (user.portfolioUrl) socialCount++;
    if (user.codingPlatformLinks && user.codingPlatformLinks.length > 0) socialCount++;
    completeness += (socialCount / 4) * 20;

    user.profileCompleteness = Math.min(Math.round(completeness), 100);

    const updatedUser = await user.save();

    await AuditLog.create({
      action: 'PROFILE_UPDATE',
      performedBy: user._id,
      details: 'Updated profile details',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select('-password -__v -failedLoginAttempts -lastLogin -accountLockedUntil -passwordChangedAt');

  if (user) {
    // Privacy Filter
    // If user has privacy settings, apply them here. 
    // For now, we'll hide contact info if not explicitly allowed (assuming default is private or we just hide sensitive info)
    // The requirement says "Privacy Settings (Hide Phone/Email)". 
    // Let's assume we send everything but the frontend hides it, OR better, we don't send it unless public.
    // Since we don't have a privacy settings field yet, let's just send safe data.
    
    const publicProfile = {
      name: user.name,
      username: user.username,
      department: user.department,
      year: user.year,
      skills: user.skills,
      linkedInUrl: user.linkedInUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      about: user.about,
      projects: user.projects || [],
      // Add other safe fields
      cgpa: user.cgpa, // Maybe sensitive?
      profileCompleteness: user.profileCompleteness
    };
    
    res.json(publicProfile);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markNotificationsRead = async (req: any, res: Response) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'Notifications marked as read' });
};

export const uploadProfilePhoto = async (req: any, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const user = req.user;
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const extension = req.file.originalname.split('.').pop() || 'jpg';
  // Use a local URL so the file can be downloaded/viewed
  // The multer filename already contains the extension correctly, so we don't append it again
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  user.profilePhoto = fileUrl;
  await user.save();

  await AuditLog.create({
    action: 'PROFILE_PHOTO_UPLOAD',
    performedBy: user._id,
    details: 'Uploaded new profile photo',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ profilePhoto: fileUrl });
};
