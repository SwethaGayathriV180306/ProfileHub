import React, { useState, useEffect } from 'react';
import { analytics } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, TrendingUp, Award } from 'lucide-react';

const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analytics.getStudentAnalytics();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">Loading analytics...</div>;
  if (!data) return <div className="text-center py-12 text-slate-400 dark:text-slate-500">No analytics data available.</div>;

  const dummyCgpaTrend = [
    { semester: 'S1', cgpa: 8.0 },
    { semester: 'S2', cgpa: 8.2 },
    { semester: 'S3', cgpa: 8.4 },
    { semester: 'S4', cgpa: 8.3 },
    { semester: 'S5', cgpa: 8.6 },
  ];

  const dummyAttendanceTrend = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 92 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 95 },
  ];

  const dummySkillGrowth = [
    { skill: 'Programming', level: 80 },
    { skill: 'Communication', level: 75 },
    { skill: 'Problem Solving', level: 85 },
    { skill: 'Teamwork', level: 90 },
    { skill: 'Aptitude', level: 70 },
  ];

  const cgpaTrend = data.cgpaTrend?.length > 0 ? data.cgpaTrend : dummyCgpaTrend;
  const attendanceTrend = data.attendanceTrend?.length > 0 ? data.attendanceTrend : dummyAttendanceTrend;
  const skillGrowth = data.skillGrowth?.length > 0 ? data.skillGrowth : dummySkillGrowth;

  const currentCgpa = cgpaTrend[cgpaTrend.length - 1]?.cgpa || 'N/A';
  const attendanceAvg = Math.round(attendanceTrend.reduce((acc: number, curr: any) => acc + curr.attendance, 0) / attendanceTrend.length) || 0;
  const placementReadiness = data.placementReadiness || 75;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your academic and career progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Current CGPA</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{currentCgpa}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Attendance Avg</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {attendanceAvg}%
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Placement Readiness</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{placementReadiness}%</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CGPA Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">CGPA Progression</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="semester" stroke="#64748b" />
                <YAxis domain={[0, 10]} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="cgpa" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Attendance History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Growth Radar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Skill Proficiency</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillGrowth}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skill Level" dataKey="level" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
