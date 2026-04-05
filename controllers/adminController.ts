import { Request, Response } from 'express';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import Document from '../models/Document';
import bcrypt from 'bcrypt';

export const getAllStudents = async (req: any, res: Response) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
};

export const getAuditLogs = async (req: any, res: Response) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).populate('performedBy', 'name email');
  res.json(logs);
};

export const bulkApproveStudents = async (req: any, res: Response) => {
  const { studentIds } = req.body;
  
  // Logic to approve students (e.g., set status to active if such field exists)
  // For now, let's assume we are verifying their documents
  
  await AuditLog.create({
    action: 'BULK_APPROVE',
    performedBy: req.user._id,
    details: `Approved ${studentIds.length} students`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ message: 'Students approved' });
};

export const getSuspiciousFiles = async (req: any, res: Response) => {
  // Logic to flag suspicious files (e.g., large size, weird extension)
  const suspiciousDocs = await Document.find({ fileSize: { $gt: 5 * 1024 * 1024 } }); // > 5MB
  res.json(suspiciousDocs);
};

export const getPendingDocuments = async (req: any, res: Response) => {
  const pendingDocs = await Document.find({ status: 'Pending' }).populate('student', 'name email username');
  res.json(pendingDocs);
};

export const verifyDocument = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  const doc = await Document.findByIdAndUpdate(id, { status, feedback }, { new: true });
  
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  // Log action
  await AuditLog.create({
    action: 'VERIFY_DOCUMENT',
    performedBy: req.user._id,
    details: `${status} document ${doc.name} for user ${doc.student}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json(doc);
};

export const updateStudent = async (req: any, res: Response) => {
  const { id } = req.params;
  const { fullName, phone, department, academic } = req.body;

  const student = await User.findById(id);
  
  if (!student) return res.status(404).json({ message: 'Student not found' });

  student.name = fullName || student.name;
  student.phone = phone || student.phone;
  student.department = department || student.department;
  
  if (academic) {
    if (academic.cgpa !== undefined) student.cgpa = academic.cgpa;
    if (!student.academic) {
       student.academic = { cgpa: academic.cgpa, arrearCount: 0, feesDue: 0, placementFaPercentage: 0, history: [] } as any;
    }
    if (academic.arrearCount !== undefined) student.academic.arrearCount = academic.arrearCount;
  }

  await student.save();

  await AuditLog.create({
    action: 'ADMIN_UPDATE_STUDENT',
    performedBy: req.user._id,
    details: `Admin updated student records for ${student.username}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ message: 'Student updated successfully', student });
};

export const resetStudentPassword = async (req: any, res: Response) => {
  const { id } = req.params;

  const student = await User.findById(id);
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const salt = await bcrypt.genSalt(10);
  student.password = await bcrypt.hash('bitsathy', salt);
  await student.save();

  await AuditLog.create({
    action: 'ADMIN_RESET_PASSWORD',
    performedBy: req.user._id,
    details: `Admin reset password for ${student.username}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ message: 'Password reset to default (bitsathy)' });
};
