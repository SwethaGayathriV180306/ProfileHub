import React, { useState } from 'react';
import { StudentProfile } from '../../../types';
import { SectionCard } from './SectionCard';
import { Input, Select } from '../../ui/Input';

interface PersonalSectionProps {
  profile: StudentProfile;
  onUpdate: (updatedData: Partial<StudentProfile>) => Promise<void>;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    dateOfAdmission: profile.dateOfAdmission ? new Date(profile.dateOfAdmission).toISOString().split('T')[0] : '',
    gender: profile.gender,
    bloodGroup: profile.bloodGroup || '',
    phone: profile.phone,
    about: profile.about || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update personal info', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Personal Information"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => {
        setFormData({
          fullName: profile.fullName,
          dateOfAdmission: profile.dateOfAdmission ? new Date(profile.dateOfAdmission).toISOString().split('T')[0] : '',
          gender: profile.gender,
          bloodGroup: profile.bloodGroup || '',
          phone: profile.phone,
          about: profile.about || ''
        });
        setIsEditing(false);
      }}
      loading={loading}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.fullName || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date of Admission</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.dateOfAdmission || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.gender || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Group</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.bloodGroup || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.phone || '-'}</p>
          </div>
          <div className="md:col-span-2 space-y-1 mt-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">About / Bio</p>
            <p className="text-base font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 leading-relaxed">
              {formData.about ? formData.about : <span className="text-slate-400 italic">No bio provided yet. Click edit to add something about yourself.</span>}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Date of Admission"
            type="date"
            value={formData.dateOfAdmission}
            onChange={(e) => setFormData({ ...formData, dateOfAdmission: e.target.value })}
          />
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          <Input
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            placeholder="e.g. O+"
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About / Bio</label>
            <textarea
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:text-white"
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>
      )}
    </SectionCard>
  );
};
