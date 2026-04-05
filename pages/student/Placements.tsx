import React, { useState, useEffect } from 'react';
import { placement } from '../../services/api';
import { Placement, Internship } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Plus, Briefcase, Award } from 'lucide-react';

const Placements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'placements' | 'internships'>('placements');
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [resumeStrength, setResumeStrength] = useState(0);

  // Form State
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placementsRes, internshipsRes, strengthRes] = await Promise.all([
        placement.getPlacements(),
        placement.getInternships(),
        placement.getResumeStrength()
      ]);
      const dummyPlacements = [
        { id: 'dp1', companyName: 'Acme Corp', role: 'Software Engineer', status: 'Applied', appliedDate: new Date().toISOString() },
        { id: 'dp2', companyName: 'Global Tech', role: 'Frontend Developer', status: 'Shortlisted', appliedDate: new Date(Date.now() - 86400000 * 5).toISOString(), ctcOffered: 12 },
      ];
      
      const dummyInternships = [
        { id: 'di1', companyName: 'InnovateX', role: 'Summer Intern', status: 'Ongoing', duration: '3 months', startDate: new Date(Date.now() - 86400000 * 30).toISOString(), stipend: 25000 },
      ];

      setPlacements(placementsRes.data.length > 0 ? placementsRes.data : dummyPlacements);
      setInternships(internshipsRes.data.length > 0 ? internshipsRes.data : dummyInternships);
      setResumeStrength(strengthRes.data.score || 70);
    } catch (error) {
      console.error('Failed to fetch placement data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'placements') {
        await placement.addPlacement(formData);
      } else {
        await placement.addInternship(formData);
      }
      setShowAddModal(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Failed to add record', error);
      alert('Failed to add record');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Career Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your placements and internships</p>
        </div>
        <div className="flex gap-4 items-center">
             <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 text-sm font-semibold">
                Resume Strength: {resumeStrength}%
             </div>
             <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add {activeTab === 'placements' ? 'Placement' : 'Internship'}
             </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'placements' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('placements')}
        >
          Placements
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'internships' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('internships')}
        >
          Internships
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'placements' ? (
          placements.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No placement records found. Add one to get started.</p>
            </div>
          ) : (
            placements.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md dark:hover:shadow-none transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{p.companyName}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{p.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.status === 'Selected' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                    p.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>Applied: {new Date(p.appliedDate).toLocaleDateString()}</p>
                  {p.ctcOffered && <p>CTC: ₹{p.ctcOffered} LPA</p>}
                  {p.interviewDate && <p>Interview: {new Date(p.interviewDate).toLocaleDateString()}</p>}
                </div>
              </div>
            ))
          )
        ) : (
          internships.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No internship records found. Add one to get started.</p>
            </div>
          ) : (
            internships.map((i) => (
              <div key={i.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md dark:hover:shadow-none transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{i.companyName}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{i.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    i.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                    i.status === 'Terminated' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                  }`}>
                    {i.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>Duration: {i.duration}</p>
                  <p>Start: {new Date(i.startDate).toLocaleDateString()}</p>
                  {i.stipend && <p>Stipend: ₹{i.stipend}/mo</p>}
                  {i.evaluationScore && <p>Score: {i.evaluationScore}/10</p>}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add {activeTab === 'placements' ? 'Placement' : 'Internship'}</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <Input label="Company Name" required value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              <Input label="Role" required value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} />
              
              {activeTab === 'placements' ? (
                <>
                  <Select label="Status" value={formData.status || 'Applied'} onChange={e => setFormData({...formData, status: e.target.value})} options={[
                    {value: 'Applied', label: 'Applied'},
                    {value: 'Shortlisted', label: 'Shortlisted'},
                    {value: 'Interview Scheduled', label: 'Interview Scheduled'},
                    {value: 'Selected', label: 'Selected'},
                    {value: 'Rejected', label: 'Rejected'}
                  ]} />
                  <Input label="CTC Offered (LPA)" type="number" value={formData.ctcOffered || ''} onChange={e => setFormData({...formData, ctcOffered: e.target.value})} />
                  <Input label="Interview Date" type="date" value={formData.interviewDate || ''} onChange={e => setFormData({...formData, interviewDate: e.target.value})} />
                </>
              ) : (
                <>
                  <Input label="Duration" placeholder="e.g. 3 months" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  <Input label="Start Date" type="date" required value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  <Input label="Stipend" type="number" value={formData.stipend || ''} onChange={e => setFormData({...formData, stipend: e.target.value})} />
                  <Select label="Status" value={formData.status || 'Ongoing'} onChange={e => setFormData({...formData, status: e.target.value})} options={[
                    {value: 'Ongoing', label: 'Ongoing'},
                    {value: 'Completed', label: 'Completed'},
                    {value: 'Terminated', label: 'Terminated'}
                  ]} />
                </>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Placements;
