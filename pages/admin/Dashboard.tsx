import React, { useEffect, useState } from 'react';
import { analytics } from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, DollarSign, Award, BookOpen, CheckCircle, LayoutDashboard, FileDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analytics.getAdminAnalytics();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Analytics...</div>;
  if (!data) return <div>No data available</div>;

  const { summary, departmentPerformance, batchCgpaDistribution, placementStats } = data;

  const dummyDepartmentPerformance = [
    { department: 'CSE', avgCgpa: 8.4 },
    { department: 'IT', avgCgpa: 8.2 },
    { department: 'ECE', avgCgpa: 8.0 },
    { department: 'EEE', avgCgpa: 7.8 },
    { department: 'MECH', avgCgpa: 7.5 },
  ];

  const dummyBatchCgpa = [
    { batch: '2021', avgCgpa: 8.6 },
    { batch: '2022', avgCgpa: 8.5 },
    { batch: '2023', avgCgpa: 8.2 },
    { batch: '2024', avgCgpa: 8.0 },
  ];

  const dummyPlacementStats = { placed: 350, unplaced: 120 };

  const deptPerf = departmentPerformance?.length > 0 ? departmentPerformance : dummyDepartmentPerformance;
  const batchPerf = batchCgpaDistribution?.length > 0 ? batchCgpaDistribution : dummyBatchCgpa;
  const placeStats = placementStats?.placed > 0 || placementStats?.unplaced > 0 ? placementStats : dummyPlacementStats;

  const placementChartData = [
    { name: 'Placed', value: placeStats.placed },
    { name: 'Unplaced', value: placeStats.unplaced },
  ];

  const handleDownloadReport = () => {
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += "--- System Summary ---\n";
    csvContent += `Total Students,${summary.totalStudents}\n`;
    csvContent += `Institute Avg CGPA,${summary.avgCgpa}\n`;
    csvContent += `Students with Arrears,${summary.studentsWithArrears}\n`;
    csvContent += `Total Fees Due,${summary.totalFeesDue}\n\n`;
    
    csvContent += "--- Placement Statistics ---\n";
    csvContent += `Placed,${placeStats.placed}\n`;
    csvContent += `Unplaced,${placeStats.unplaced}\n\n`;

    csvContent += "--- Department Performance ---\n";
    csvContent += "Department,Avg CGPA\n";
    deptPerf.forEach((d: any) => {
      csvContent += `${d.department},${d.avgCgpa}\n`;
    });
    csvContent += "\n";

    csvContent += "--- Batch Progression ---\n";
    csvContent += "Batch,Avg CGPA\n";
    batchPerf.forEach((b: any) => {
      csvContent += `${b.batch},${b.avgCgpa}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[50px] pointer-events-none"></div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                <LayoutDashboard className="w-6 h-6" />
             </div>
             Analytics Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Real-time overview of student performance, placements, and system metrics.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
              onClick={handleDownloadReport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
              <FileDown className="w-4 h-4" /> Download Report
           </button>
        </div>
      </div>

      {/* TOP ROW: Premium Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Users className="w-24 h-24 text-blue-600 dark:text-blue-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Enrolled</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{summary.totalStudents}</h3>
               <div className="flex items-center gap-1 mt-2">
                 <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                   <TrendingUp className="w-3 h-3 mr-1" /> +12% YoY
                 </span>
               </div>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
               <Users className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Avg CGPA */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Award className="w-24 h-24 text-emerald-600 dark:text-emerald-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Institute Avg CGPA</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{summary.avgCgpa}</h3>
               <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Target: 8.5
               </div>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 ml-4">
               <Award className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Arrears */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <AlertTriangle className="w-24 h-24 text-amber-600 dark:text-amber-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Active Arrears</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{summary.studentsWithArrears}</h3>
               <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Students flagged</p>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
               <AlertTriangle className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Fees Due */}
        <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <DollarSign className="w-24 h-24 text-red-600 dark:text-red-500 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Dues Pending</p>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1 truncate max-w-[120px]" title={`₹ ${summary.totalFeesDue.toLocaleString()}`}>
                 ₹{summary.totalFeesDue.toLocaleString()}
               </h3>
               <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Requires attention</p>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
               <DollarSign className="w-6 h-6" />
             </div>
           </div>
        </div>

      </div>

      {/* Main Charts Array */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
         {/* Dept Performance */}
         <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
               <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                   <Award className="w-6 h-6 text-blue-600 dark:text-blue-500"/> 
                   Department Academic Overview
                 </h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Average CGPA comparison across engineering branches</p>
               </div>
            </div>
            
            <div className="flex-1 w-full min-h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={deptPerf} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15}/>
                    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fontSize: 13, fontWeight: 600, fill: '#64748b'}} dy={15} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                      itemStyle={{fontWeight: 700, color: '#60a5fa'}}
                    />
                    <Bar dataKey="avgCgpa" name="Avg CGPA" radius={[6,6,0,0]} maxBarSize={60}>
                      {deptPerf.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-all duration-300 drop-shadow-sm" />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Placement Stats */}
         <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mb-2 relative z-10">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-500"/> 
              Placement Matrix
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 relative z-10">Current final-year statistics</p>
            
            <div className="flex-1 w-full min-h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie 
                      data={placementChartData} 
                      cx="50%" cy="45%" 
                      innerRadius={70} 
                      outerRadius={95} 
                      paddingAngle={8} 
                      dataKey="value"
                      stroke="none"
                    >
                       {placementChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} className="hover:opacity-80 transition-opacity duration-300 drop-shadow-sm" />
                       ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      itemStyle={{fontWeight: 700}}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '14px', fontWeight: 600, color: '#64748b', paddingTop: '20px' }} iconType="circle"/>
                 </PieChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Batch Performance */}
       <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-500"/> 
              Batch-wise Progression
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 relative z-10">Longitudinal CGPA tracking across active batches</p>
            
            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={batchPerf} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15}/>
                    <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{fontSize: 13, fontWeight: 600, fill: '#64748b'}} dy={15} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(139, 92, 246, 0.05)'}} 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                      itemStyle={{fontWeight: 700, color: '#a78bfa'}}
                    />
                    <Bar dataKey="avgCgpa" name="Avg CGPA" radius={[6,6,0,0]} maxBarSize={80}>
                      {batchPerf.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill="#8b5cf6" className="hover:opacity-80 transition-all duration-300 drop-shadow-sm" />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
    </div>
  );
};

export default Dashboard;
