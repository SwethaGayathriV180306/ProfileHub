import React, { useState } from 'react';
import { StudentProfile } from '../../../types';
import { SectionCard } from './SectionCard';
import { Input } from '../../ui/Input';

interface ContactSectionProps {
  profile: StudentProfile;
  onUpdate: (updatedData: Partial<StudentProfile>) => Promise<void>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    permanentAddress: profile.permanentAddress || '',
    currentAddress: profile.currentAddress || '',
    parentName: profile.parentName || '',
    parentContact: profile.parentContact || '',
    emergencyContact: profile.emergencyContact || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update contact info', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Contact Information"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => {
        setFormData({
          permanentAddress: profile.permanentAddress || '',
          currentAddress: profile.currentAddress || '',
          parentName: profile.parentName || '',
          parentContact: profile.parentContact || '',
          emergencyContact: profile.emergencyContact || ''
        });
        setIsEditing(false);
      }}
      loading={loading}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Permanent Address</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.permanentAddress || '-'}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Address</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.currentAddress || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parent / Guardian Name</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.parentName || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parent Contact Number</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formData.parentContact || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-red-500 dark:text-red-400">Emergency Contact</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{formData.emergencyContact || '-'}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="md:col-span-2">
            <Input
              label="Permanent Address"
              value={formData.permanentAddress}
              onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
              placeholder="Full permanent address"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Current Address"
              value={formData.currentAddress}
              onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
              placeholder="Current hostel or PG address"
            />
          </div>
          <Input
            label="Parent / Guardian Name"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          />
          <Input
            label="Parent Contact Number"
            value={formData.parentContact}
            onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
          />
          <Input
            label="Emergency Contact Number"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />
        </div>
      )}
    </SectionCard>
  );
};
