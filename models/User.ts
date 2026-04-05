import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Basic Info
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  profilePhoto?: string;
  username: string; // Added for Roll Number
  phone?: string; // Added Phone Number
  department?: string;
  year?: string;
  semester?: string;
  gender?: string;
  about?: string;
  
  // Personal Details
  rollNumber?: string;
  dob?: Date;
  bloodGroup?: string;
  permanentAddress?: string;
  currentAddress?: string;
  parentName?: string;
  parentContact?: string;
  emergencyContact?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  codingPlatformLinks?: { name: string; url: string }[];
  dateOfAdmission?: Date;
  expectedGraduationYear?: number;
  modeOfAdmission?: string;

  // Academic Details
  tenthPercentage?: number;
  tenthBoard?: string;
  tenthYear?: number;
  twelfthPercentage?: number;
  twelfthBoard?: string;
  twelfthYear?: number;
  diplomaPercentage?: number;
  diplomaBoard?: string;
  diplomaYear?: number;
  cgpa?: number;
  backlogs?: {
    subject: string;
    semester: number;
    status: 'Cleared' | 'Pending';
  }[];
  electives?: string[];
  specialization?: string; // Minor/Honors
  scholarshipDetails?: string;

  // Skills
  skills: {
    category: 'Programming Languages' | 'Frameworks' | 'Databases' | 'Tools' | 'Soft Skills';
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];

  projects?: {
    id?: string;
    title?: string;
    techStack?: string;
    description?: string;
    link?: string;
    github?: string;
  }[];

  certifications?: {
    id?: string;
    name?: string;
    issuer?: string;
    date?: string;
    url?: string;
  }[];

  education?: {
    id?: string;
    level?: '10th' | '12th' | 'UG' | 'PG';
    institution?: string;
    year?: string;
    percentage?: string;
    board?: string;
  }[];

  // Placement & Career
  placementStatus: 'Eligible' | 'Not Eligible' | 'Placed' | 'Opted Out';
  resumeStrengthScore: number;
  profileCompleteness: number;

  // Security
  failedLoginAttempts: number;
  lastLogin?: Date;
  accountLockedUntil?: Date;
  passwordChangedAt?: Date;
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
  
  // Account Settings
  settings?: {
    twoFactorEnabled: boolean;
    notificationsEnabled: boolean;
    theme: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profilePhoto: { type: String },
  username: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  semester: { type: String },
  gender: { type: String },

  // Personal Details
  rollNumber: { type: String },
  dob: { type: Date },
  about: { type: String }, // Bio / About Me
  bloodGroup: { type: String },
  permanentAddress: { type: String },
  currentAddress: { type: String },
  parentName: { type: String },
  parentContact: { type: String },
  emergencyContact: { type: String },
  linkedInUrl: { type: String },
  githubUrl: { type: String },
  portfolioUrl: { type: String },
  codingPlatformLinks: [{
    name: String,
    url: String
  }],
  dateOfAdmission: { type: Date },
  expectedGraduationYear: { type: Number },
  modeOfAdmission: { type: String },

  // Academic Details
  tenthPercentage: { type: Number },
  tenthBoard: { type: String },
  tenthYear: { type: Number },
  twelfthPercentage: { type: Number },
  twelfthBoard: { type: String },
  twelfthYear: { type: Number },
  diplomaPercentage: { type: Number },
  diplomaBoard: { type: String },
  diplomaYear: { type: Number },
  cgpa: { type: Number },
  backlogs: [{
    subject: String,
    semester: Number,
    status: { type: String, enum: ['Cleared', 'Pending'] }
  }],
  electives: [String],
  specialization: { type: String },
  scholarshipDetails: { type: String },

  // Extended Academic & Dashboard Data
  academic: {
    placementFaPercentage: { type: Number, default: 0 },
    arrearCount: { type: Number, default: 0 },
    feesDue: { type: Number, default: 0 },
    history: [{
      semester: String,
      sgpa: Number
    }]
  },

  // Arrays matching StudentProfile
  education: [{
    id: String,
    level: { type: String, enum: ['10th', '12th', 'UG', 'PG'] },
    institution: String,
    year: String,
    percentage: String,
    board: String
  }],

  projects: [{
    id: String,
    title: String,
    techStack: String,
    description: String,
    link: String,
    github: String
  }],

  certifications: [{
    id: String,
    name: String,
    issuer: String,
    date: String,
    url: String
  }],

  // Skills
  skills: [{
    id: String,
    category: { type: String, enum: ['Programming Languages', 'Frameworks', 'Databases', 'Tools', 'Soft Skills'] },
    name: String,
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
  }],

  // Placement & Career
  placementStatus: { type: String, enum: ['Eligible', 'Not Eligible', 'Placed', 'Opted Out'], default: 'Eligible' },
  resumeStrengthScore: { type: Number, default: 0 },
  profileCompleteness: { type: Number, default: 0 },

  // Security
  failedLoginAttempts: { type: Number, default: 0 },
  lastLogin: { type: Date },
  accountLockedUntil: { type: Date },
  passwordChangedAt: { type: Date },
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
  
  // Account Settings
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },

}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
