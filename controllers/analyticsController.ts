import { Request, Response } from 'express';
import User from '../models/User';
import Placement from '../models/Placement';

export const getStudentAnalytics = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);
  const placements = await Placement.find({ student: req.user._id });

  // Mock data for trends if not available in DB
  const cgpaTrend = [
    { semester: 1, cgpa: 7.5 },
    { semester: 2, cgpa: 7.8 },
    { semester: 3, cgpa: 8.0 },
    { semester: 4, cgpa: 8.2 },
    { semester: 5, cgpa: 8.5 },
    { semester: 6, cgpa: 8.7 },
  ];

  const attendanceTrend = [
    { month: 'Jan', attendance: 90 },
    { month: 'Feb', attendance: 85 },
    { month: 'Mar', attendance: 95 },
    { month: 'Apr', attendance: 92 },
    { month: 'May', attendance: 88 },
  ];

  const skillGrowth = [
    { skill: 'React', level: 80 },
    { skill: 'Node.js', level: 70 },
    { skill: 'MongoDB', level: 60 },
    { skill: 'TypeScript', level: 50 },
  ];

  const placementReadiness = user?.resumeStrengthScore || 0;

  res.json({
    cgpaTrend,
    attendanceTrend,
    skillGrowth,
    placementReadiness,
  });
};

export const getAdminAnalytics = async (req: any, res: Response) => {
  const users = await User.find({ role: 'student' });
  const placements = await Placement.find();

  // Summary Stats
  const totalStudents = users.length;
  const avgCgpa = users.length > 0 
    ? (users.reduce((acc, user) => acc + (user.cgpa || 0), 0) / users.length).toFixed(2) 
    : 0;
  const studentsWithArrears = users.filter(user => 
    user.backlogs && user.backlogs.some(b => b.status === 'Pending')
  ).length;
  // Mock fees due for now as it's not in the model yet, or assume 0
  const totalFeesDue = 0; 

  // Department Performance
  // Group users by department and calculate avg CGPA
  const deptMap = new Map<string, { total: number, count: number }>();
  users.forEach(user => {
    if (user.department && user.cgpa) {
      const current = deptMap.get(user.department) || { total: 0, count: 0 };
      deptMap.set(user.department, { total: current.total + user.cgpa, count: current.count + 1 });
    }
  });
  
  const departmentPerformance = Array.from(deptMap.entries()).map(([department, data]) => ({
    department,
    avgCgpa: parseFloat((data.total / data.count).toFixed(2))
  }));

  // Batch-wise CGPA Distribution
  // Group by year/batch
  const batchMap = new Map<string, { total: number, count: number }>();
  users.forEach(user => {
    if (user.year && user.cgpa) { // Assuming 'year' is like "1", "2", etc. or batch year
       const batch = `Year ${user.year}`;
       const current = batchMap.get(batch) || { total: 0, count: 0 };
       batchMap.set(batch, { total: current.total + user.cgpa, count: current.count + 1 });
    }
  });

  const batchCgpaDistribution = Array.from(batchMap.entries()).map(([batch, data]) => ({
    batch,
    avgCgpa: parseFloat((data.total / data.count).toFixed(2))
  }));

  // Placement Statistics
  const placedCount = placements.filter((p) => p.status === 'Selected').length;
  const placementStats = {
    placed: placedCount,
    unplaced: totalStudents - placedCount,
    offers: placements.length,
  };

  res.json({
    summary: {
      totalStudents,
      avgCgpa,
      studentsWithArrears,
      totalFeesDue
    },
    departmentPerformance,
    batchCgpaDistribution,
    placementStats,
  });
};
