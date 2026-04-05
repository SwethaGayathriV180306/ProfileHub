import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { student as studentApi } from '../../services/api';
import { StudentProfile } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Phone, User, Monitor, Clock, TrendingUp, AlertTriangle, IndianRupee, BookOpen, GraduationCap, MapPin, FlaskConical, Home } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (user) {
      studentApi.getProfile()
        .then(res => setProfile(res.data))
        .catch(err => {
          if (err.response?.status !== 401) console.error(err);
        });
    }
  }, [user]);

  if (!profile) return <div>Loading Profile...</div>;

  // Chart Colors (Blue Shades for Light Mode)
  const COLORS = ['#1e3a8a', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6'];

  const dummyAcademicHistory = [
    { semester: 'Sem 1', sgpa: 8.2 },
    { semester: 'Sem 2', sgpa: 8.5 },
    { semester: 'Sem 3', sgpa: 8.1 },
    { semester: 'Sem 4', sgpa: 8.8 },
    { semester: 'Sem 5', sgpa: 8.6 },
  ];

  const academicHistory = profile.academic?.history?.length > 0 ? profile.academic.history : dummyAcademicHistory;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[50px] pointer-events-none"></div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{(profile.fullName || user?.name || 'Student').split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Here's your academic portfolio overview for the current semester.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-inner">
             <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AY 2024 - 2025</span>
          </div>
        </div>
      </div>

      {/* TOP ROW: Premium Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CGPA */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <GraduationCap className="w-24 h-24 text-blue-600 dark:text-blue-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Cumulative GPA</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{profile.academic?.cgpa || 'N/A'}</h3>
               <div className="flex items-center gap-1 mt-2">
                 <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                   <TrendingUp className="w-3 h-3 mr-1" /> Top 10%
                 </span>
               </div>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
               <GraduationCap className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Placement FA */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-24 h-24 text-emerald-600 dark:text-emerald-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div className="w-full">
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Placement FA</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{profile.academic?.placementFaPercentage || 0}%</h3>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden shadow-inner">
                 <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{width: `${profile.academic?.placementFaPercentage}%`}}></div>
               </div>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 ml-4">
               <TrendingUp className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Arrear Count */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <BookOpen className="w-24 h-24 text-amber-600 dark:text-amber-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Active Arrears</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{profile.academic?.arrearCount || 0}</h3>
               <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">All clear • Eligible</p>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
               <BookOpen className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Fees Due */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <IndianRupee className="w-24 h-24 text-red-600 dark:text-red-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Fees Pending</p>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1 truncate max-w-[120px]" title={`₹ ${profile.academic?.feesDue?.toLocaleString() || 0}`}>
                 ₹{profile.academic?.feesDue?.toLocaleString() || 0}
               </h3>
               {profile.academic?.feesDue > 0 ? (
                 <button className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg mt-2 shadow-md shadow-red-500/20 transition-colors">
                   Pay Now
                 </button>
               ) : (
                 <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50 mt-2">
                   Fully Paid
                 </span>
               )}
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
               <IndianRupee className="w-6 h-6" />
             </div>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SGPA CHART */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden">
           {/* Decorative Chart Glow */}
           <div className="absolute top-[20%] right-[20%] w-64 h-64 bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
           
           <div className="flex justify-between items-center mb-8 relative z-10">
             <div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                 <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-500" /> 
                 Academic Performance (SGPA)
               </h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Semester-wise progression timeline</p>
             </div>
           </div>
           
           <div className="flex-1 w-full min-h-[350px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={academicHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                 <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
                 <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                    contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                    itemStyle={{fontWeight: 700, color: '#60a5fa'}}
                 />
                 <Bar dataKey="sgpa" name="SGPA" radius={[6, 6, 0, 0]} maxBarSize={50}>
                   {academicHistory.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all duration-300 hover:opacity-80 drop-shadow-sm" />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* RIGHT COLUMN: IDENTITY & BIOMETRIC */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Identity Card Mini */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-600/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              Digital Identity
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{profile.fullName}</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{profile.username}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400"><GraduationCap size={16}/></div>
                   <div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Program</p>
                     <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-32" title={profile.department}>{profile.department}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Sem</p>
                   <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.semester ? profile.semester.split('-')?.[1]?.trim() || 'I' : 'I'}</p>
                 </div>
               </div>

               {profile.mentor && (
                 <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400"><User size={16}/></div>
                     <div>
                       <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Faculty Mentor</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.mentor?.name || 'Assigned Soon'}</p>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Biometric List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[350px]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Biometric Logs</span>
              <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400">Recent</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
              {profile.biometricLogs?.length > 0 ? profile.biometricLogs.map((log) => (
                <div key={log.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.time}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {log.device} <Monitor size={12} className="text-blue-500"/>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <Clock className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No logs recorded today</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;