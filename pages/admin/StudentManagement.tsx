import React, { useState, useEffect, useContext } from 'react';
import { admin as adminApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { StudentProfile, DEPARTMENTS } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Search, Filter, Download, MoreHorizontal, Edit, Lock, Trash2, Eye, X, CheckSquare, Square } from 'lucide-react';

const StudentManagement: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [filtered, setFiltered] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [arrearFilter, setArrearFilter] = useState(false);

  // Modals
  const [editProfile, setEditProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminApi.getStudents();
      setProfiles(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let res = profiles;
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(p => p.fullName?.toLowerCase().includes(s) || p.username?.toLowerCase().includes(s));
    }
    if (deptFilter) res = res.filter(p => p.department === deptFilter);
    if (yearFilter) res = res.filter(p => p.year === yearFilter);
    if (arrearFilter) res = res.filter(p => p.academic?.arrearCount > 0);
    setFiltered(res);
  }, [search, deptFilter, yearFilter, arrearFilter, profiles]);

  const handleExportCSV = () => {
    const headers = ["Roll No", "Name", "Department", "Year", "CGPA", "Arrears", "Fees Due", "Email"];
    const rows = filtered.map(p => [
      p.username, p.fullName, p.department, p.year, p.academic?.cgpa, p.academic?.arrearCount, p.academic?.feesDue, p.email
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfile) return;
    try {
      await adminApi.updateStudent(editProfile.id, {
        fullName: editProfile.fullName,
        phone: editProfile.phone,
        department: editProfile.department,
        academic: editProfile.academic
      });
      alert('Student updated successfully');
      setEditProfile(null);
      fetchStudents();
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleResetPassword = async (studentId: string) => {
    if(confirm('Reset password to default (bitsathy)?')) {
        try {
          await adminApi.resetStudentPassword(studentId);
          alert('Password reset successfully');
        } catch(e) {
          alert('Password reset failed');
        }
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Approve ${selectedIds.length} students?`)) {
      try {
        await adminApi.bulkApprove(selectedIds);
        alert('Students approved successfully');
        fetchStudents();
        setSelectedIds([]);
      } catch (error) {
        console.error('Bulk approve failed', error);
        alert('Bulk approve failed');
      }
    }
  };

  if (loading) return <div>Loading Students...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage {profiles.length} student records</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkApprove} className="bg-emerald-600 hover:bg-emerald-700">
              Approve Selected ({selectedIds.length})
            </Button>
          )}
          <Button onClick={handleExportCSV} variant="outline"><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
           <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500 w-5 h-5" />
           <Input placeholder="Search by Roll No or Name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
        </div>
        <select className="border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-white" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
           <option value="">All Departments</option>
           {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-white" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
           <option value="">All Years</option>
           <option value="1">1st Year</option>
           <option value="2">2nd Year</option>
           <option value="3">3rd Year</option>
           <option value="4">4th Year</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
           <input type="checkbox" checked={arrearFilter} onChange={e => setArrearFilter(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/>
           With Arrears
        </label>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare className="w-5 h-5 text-blue-600"/> : <Square className="w-5 h-5"/>}
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Academic Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(p.id)} className="text-slate-400 hover:text-slate-600">
                      {selectedIds.includes(p.id) ? <CheckSquare className="w-5 h-5 text-blue-600"/> : <Square className="w-5 h-5"/>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {p.fullName?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">{p.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{p.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[180px]" title={p.department}>{p.department}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{p.year} Year • Sem {p.semester || '?'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">CGPA: {p.academic?.cgpa || 'N/A'}</div>
                    {p.academic?.arrearCount > 0 ? 
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-bold">Arrears: {p.academic.arrearCount}</span> : 
                      <span className="text-xs text-green-600 dark:text-green-400">All Clear</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'}`}>
                      {p.isActive ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setEditProfile(p)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Edit"><Edit size={16}/></button>
                       <button onClick={() => handleResetPassword(p.id)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Reset Pass"><Lock size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500">No students found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editProfile && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="px-6 py-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Student: {editProfile.username}</h3>
                  <button onClick={() => setEditProfile(null)}><X className="text-slate-500 dark:text-slate-400 hover:text-red-500"/></button>
               </div>
               <form onSubmit={handleUpdateStudent} className="p-6 overflow-y-auto space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Full Name" value={editProfile.fullName} onChange={e => setEditProfile({...editProfile, fullName: e.target.value})} />
                     <Input label="Phone" value={editProfile.phone} onChange={e => setEditProfile({...editProfile, phone: e.target.value})} />
                     <div className="col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
                        <select className="w-full border dark:border-slate-700 rounded p-2 text-sm mt-1 bg-white dark:bg-slate-900 dark:text-white" value={editProfile.department} onChange={e => setEditProfile({...editProfile, department: e.target.value})}>
                           {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <Input label="CGPA" type="number" step="0.01" value={editProfile.academic?.cgpa || 0} onChange={e => setEditProfile({...editProfile, academic: {...editProfile.academic, cgpa: parseFloat(e.target.value)}})} />
                     <Input label="Arrear Count" type="number" value={editProfile.academic?.arrearCount || 0} onChange={e => setEditProfile({...editProfile, academic: {...editProfile.academic, arrearCount: parseInt(e.target.value)}})} />
                  </div>
                  <div className="pt-4 border-t flex justify-end gap-3">
                     <Button type="button" variant="secondary" onClick={() => setEditProfile(null)}>Cancel</Button>
                     <Button type="submit">Save Changes</Button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default StudentManagement;
