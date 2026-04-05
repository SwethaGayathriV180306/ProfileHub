import React, { useState, useEffect } from 'react';
import { admin as adminApi } from '../../services/api';
import { AdminAuditLog } from '../../types';
import { Shield } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await adminApi.getAuditLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Logs...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Security Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track all administrative actions.</p>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Admin ID</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Details</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">IP Address</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map(log => (
                     <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{log.adminId}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded text-xs font-bold border border-blue-100 dark:border-blue-800/50">{log.action}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{log.details}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 text-right font-mono">{log.ipAddress}</td>
                     </tr>
                  ))}
                  {logs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400 dark:text-slate-500">No activity recorded yet.</td></tr>}
               </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};

export default AuditLogs;
