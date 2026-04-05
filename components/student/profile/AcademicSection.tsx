import React, { useState } from 'react';
import { StudentProfile } from '../../../types';
import { SectionCard } from './SectionCard';
import { Input } from '../../ui/Input';

interface AcademicSectionProps {
  profile: StudentProfile;
  onUpdate: (updatedData: Partial<StudentProfile>) => Promise<void>;
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenthPercentage: profile.tenthPercentage || '',
    tenthBoard: profile.tenthBoard || '',
    tenthYear: profile.tenthYear || '',
    twelfthPercentage: profile.twelfthPercentage || '',
    twelfthBoard: profile.twelfthBoard || '',
    twelfthYear: profile.twelfthYear || '',
    diplomaPercentage: profile.diplomaPercentage || '',
    cgpa: profile.academic?.cgpa || '',
    scholarshipDetails: profile.scholarshipDetails || '',
    modeOfAdmission: profile.modeOfAdmission || '',
    dateOfAdmission: profile.dateOfAdmission ? new Date(profile.dateOfAdmission).toISOString().split('T')[0] : '',
    expectedGraduationYear: profile.expectedGraduationYear || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate({
        ...formData,
        tenthPercentage: parseFloat(formData.tenthPercentage as string) || 0,
        tenthYear: parseInt(formData.tenthYear as string) || 0,
        twelfthPercentage: parseFloat(formData.twelfthPercentage as string) || 0,
        twelfthYear: parseInt(formData.twelfthYear as string) || 0,
        diplomaPercentage: parseFloat(formData.diplomaPercentage as string) || 0,
        academic: { ...profile.academic, cgpa: parseFloat(formData.cgpa as string) || 0 },
        modeOfAdmission: formData.modeOfAdmission,
        dateOfAdmission: formData.dateOfAdmission,
        expectedGraduationYear: parseInt(formData.expectedGraduationYear as string) || 0
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update academic info', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Academic Identity"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => {
        setFormData({
          tenthPercentage: profile.tenthPercentage || '',
          tenthBoard: profile.tenthBoard || '',
          tenthYear: profile.tenthYear || '',
          twelfthPercentage: profile.twelfthPercentage || '',
          twelfthBoard: profile.twelfthBoard || '',
          twelfthYear: profile.twelfthYear || '',
          diplomaPercentage: profile.diplomaPercentage || '',
          cgpa: profile.academic?.cgpa || '',
          scholarshipDetails: profile.scholarshipDetails || '',
          modeOfAdmission: profile.modeOfAdmission || '',
          dateOfAdmission: profile.dateOfAdmission ? new Date(profile.dateOfAdmission).toISOString().split('T')[0] : '',
          expectedGraduationYear: profile.expectedGraduationYear || ''
        });
        setIsEditing(false);
      }}
      loading={loading}
    >
      {!isEditing ? (
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-extrabold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500"></span> Secondary School (10th)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Percentage / CGPA</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.tenthPercentage || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Board</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.tenthBoard || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year of Passing</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.tenthYear || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500"></span> Higher Secondary (12th)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Percentage</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.twelfthPercentage || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Board</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.twelfthBoard || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year of Passing</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.twelfthYear || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-purple-600 dark:text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-500"></span> College / University
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current CGPA</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{formData.cgpa || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mode of Admission</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.modeOfAdmission || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Admission Date</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.dateOfAdmission || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expected Graduation</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.expectedGraduationYear || '-'}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scholarship Details</p>
                <p className="text-base font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {formData.scholarshipDetails ? formData.scholarshipDetails : <span className="text-slate-400 italic">None reported</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="md:col-span-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="text-sm font-extrabold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">Secondary School (10th)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Percentage / CGPA"
                type="number"
                value={formData.tenthPercentage}
                onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
              />
              <Input
                label="Board"
                value={formData.tenthBoard}
                onChange={(e) => setFormData({ ...formData, tenthBoard: e.target.value })}
              />
              <Input
                label="Year of Passing"
                type="number"
                value={formData.tenthYear}
                onChange={(e) => setFormData({ ...formData, tenthYear: e.target.value })}
              />
            </div>
          </div>

          <div className="md:col-span-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">Higher Secondary (12th)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Percentage"
                type="number"
                value={formData.twelfthPercentage}
                onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })}
              />
              <Input
                label="Board"
                value={formData.twelfthBoard}
                onChange={(e) => setFormData({ ...formData, twelfthBoard: e.target.value })}
              />
              <Input
                label="Year of Passing"
                type="number"
                value={formData.twelfthYear}
                onChange={(e) => setFormData({ ...formData, twelfthYear: e.target.value })}
              />
            </div>
          </div>

          <div className="md:col-span-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="text-sm font-extrabold text-purple-600 dark:text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">College / University</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Current CGPA"
                type="number"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                step="0.01"
              />
              <Input
                label="Diploma Percentage (if applicable)"
                type="number"
                value={formData.diplomaPercentage}
                onChange={(e) => setFormData({ ...formData, diplomaPercentage: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input
                  label="Scholarship Details"
                  value={formData.scholarshipDetails}
                  onChange={(e) => setFormData({ ...formData, scholarshipDetails: e.target.value })}
                  placeholder="e.g. First Graduate, Merit Scholarship"
                />
              </div>
              <Input
                label="Mode of Admission"
                value={formData.modeOfAdmission}
                onChange={(e) => setFormData({ ...formData, modeOfAdmission: e.target.value })}
                placeholder="e.g. Counselling, Management"
              />
              <Input
                label="Admission Date/Year"
                type="date"
                value={formData.dateOfAdmission}
                onChange={(e) => setFormData({ ...formData, dateOfAdmission: e.target.value })}
              />
              <Input
                label="Expected Graduation Year"
                type="number"
                value={formData.expectedGraduationYear}
                onChange={(e) => setFormData({ ...formData, expectedGraduationYear: e.target.value })}
                placeholder="e.g. 2026"
              />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
