export const Role = {
  STUDENT: 'student',
  ADMIN: 'admin'
} as const;

export type Role = typeof Role[keyof typeof Role];

export const DEPARTMENTS = [
  "AGRICULTURAL ENGINEERING",
  "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
  "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
  "BIOMEDICAL ENGINEERING",
  "BIOTECHNOLOGY",
  "CIVIL ENGINEERING",
  "COMPUTER SCIENCE AND BUSINESS SYSTEMS",
  "COMPUTER SCIENCE AND DESIGN",
  "COMPUTER SCIENCE AND ENGINEERING",
  "COMPUTER TECHNOLOGY",
  "ELECTRICAL AND ELECTRONICS ENGINEERING",
  "ELECTRONICS AND COMMUNICATION ENGINEERING",
  "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
  "FASHION TECHNOLOGY",
  "FOOD TECHNOLOGY",
  "INFORMATION SCIENCE AND ENGINEERING",
  "INFORMATION TECHNOLOGY",
  "MECHANICAL ENGINEERING",
  "MECHATRONICS ENGINEERING",
  "SCHOOL OF MANAGEMENT STUDIES",
  "TEXTILE TECHNOLOGY"
];

export interface User {
  id: string;
  username: string; 
  role: Role;
  name: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface Education {
  id: string;
  level: '10th' | '12th' | 'UG' | 'PG';
  institution: string;
  year: string;
  percentage: string;
  board?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming Languages' | 'Frameworks' | 'Databases' | 'Tools' | 'Soft Skills';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string;
  link?: string; // Live Link
  github?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Resume' | 'Certificate' | 'Project' | 'Internship' | 'Placement' | 'Other';
  fileType: string; // pdf, jpg, png
  size: number;
  uploadDate: string;
  url: string; // Blob URL
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
}

export interface BiometricLog {
  id: string;
  date: string;
  time: string;
  device: string;
}

export interface SgpaRecord {
  semester: string;
  sgpa: number;
}

export interface Placement {
  id: string;
  companyName: string;
  role: string;
  appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  ctcOffered?: number;
  offerLetterUrl?: string;
  interviewDate?: string;
  notes?: string;
}

export interface Internship {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  startDate: string;
  endDate?: string;
  stipend?: number;
  certificateUrl?: string;
  evaluationScore?: number;
  status: 'Ongoing' | 'Completed' | 'Terminated';
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  username: string; // Replaces rollNumber
  department: string;
  email: string;
  phone: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  profilePhoto?: string;
  privacy: {
    hidePhone: boolean;
    hideEmail?: boolean;
  };
  
  // Personal Details
  about?: string;
  dob?: string;
  bloodGroup?: string;
  permanentAddress?: string;
  currentAddress?: string;
  parentName?: string;
  parentContact?: string;
  emergencyContact?: string;
  dateOfAdmission?: string;
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
  backlogs?: { subject: string; semester: number; status: 'Cleared' | 'Pending' }[];
  electives?: string[];
  specialization?: string;
  scholarshipDetails?: string;

  education: Education[];
  skills: Skill[];
  projects: Project[];
  documents: Document[];
  certifications: string[]; 
  completenessScore: number;
  resumeStrengthScore?: number;
  
  // Social Links
  github?: string;
  linkedin?: string;
  website?: string;
  codingPlatformLinks?: { name: string; url: string }[];

  // Dashboard & Admin Fields
  semester: string; // e.g., "Semester - VI"
  status: string; // e.g., "CONTINUING"
  mentor?: {
    name: string;
    id: string;
    phone: string;
  };
  specialLab?: string;
  boarding?: string;
  academic: {
    cgpa: number;
    placementFaPercentage: number;
    arrearCount: number;
    feesDue: number;
    history: SgpaRecord[];
  };
  biometricLogs: BiometricLog[];
  
  placements?: Placement[];
  internships?: Internship[];
  
  settings?: {
    twoFactorEnabled: boolean;
    notificationsEnabled: boolean;
    theme: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  isRead: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}
