import { Request, Response } from 'express';
import Placement from '../models/Placement';
import Internship from '../models/Internship';
import User from '../models/User';
import AuditLog from '../models/AuditLog';

export const getPlacements = async (req: any, res: Response) => {
  const placements = await Placement.find({ student: req.user._id });
  res.json(placements);
};

export const addPlacement = async (req: any, res: Response) => {
  const { companyName, role, status, ctcOffered, offerLetterUrl, interviewDate, notes } = req.body;

  const placement = new Placement({
    student: req.user._id,
    companyName,
    role,
    status,
    ctcOffered,
    offerLetterUrl,
    interviewDate,
    notes,
  });

  const createdPlacement = await placement.save();

  await AuditLog.create({
    action: 'PLACEMENT_ADD',
    performedBy: req.user._id,
    details: `Added placement: ${companyName} - ${role}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json(createdPlacement);
};

export const getInternships = async (req: any, res: Response) => {
  const internships = await Internship.find({ student: req.user._id });
  res.json(internships);
};

export const addInternship = async (req: any, res: Response) => {
  const { companyName, role, duration, startDate, endDate, stipend, certificateUrl, evaluationScore, status } = req.body;

  const internship = new Internship({
    student: req.user._id,
    companyName,
    role,
    duration,
    startDate,
    endDate,
    stipend,
    certificateUrl,
    evaluationScore,
    status,
  });

  const createdInternship = await internship.save();

  await AuditLog.create({
    action: 'INTERNSHIP_ADD',
    performedBy: req.user._id,
    details: `Added internship: ${companyName} - ${role}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json(createdInternship);
};

export const calculateResumeStrength = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);
  const placements = await Placement.find({ student: req.user._id });
  const internships = await Internship.find({ student: req.user._id });

  let score = 0;

  if (user?.skills && user.skills.length > 0) score += 20;
  if (user?.projects && user.projects.length > 0) score += 20; // Assuming projects field exists or will be added
  if (internships.length > 0) score += 20;
  if (user?.certifications && user.certifications.length > 0) score += 20; // Assuming certifications field exists
  if (user?.cgpa && user.cgpa > 7.5) score += 20;

  if (user) {
    user.resumeStrengthScore = score;
    await user.save();
  }

  res.json({ score });
};
