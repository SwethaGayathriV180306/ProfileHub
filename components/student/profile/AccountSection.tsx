import React, { useState } from 'react';
import { StudentProfile } from '../../../types';
import { SectionCard } from './SectionCard';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Shield, Bell, Moon, Lock } from 'lucide-react';
import { auth } from '../../../services/api';

interface AccountSectionProps {
  profile: StudentProfile;
  onUpdate: (updatedData: Partial<StudentProfile>) => Promise<void>;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    twoFactorEnabled: profile.settings?.twoFactorEnabled || false,
    notificationsEnabled: profile.settings?.notificationsEnabled ?? true,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate({ settings });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    try {
      await auth.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert("Failed to change password. Please check your current password.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <SectionCard
        title="Account Settings"
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setSettings({
            twoFactorEnabled: profile.settings?.twoFactorEnabled || false,
            notificationsEnabled: profile.settings?.notificationsEnabled ?? true,
          });
          setIsEditing(false);
        }}
        loading={loading}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Two-Factor Authentication</h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            {!isEditing ? (
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${settings.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700'}`}>
                {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
              </label>
            )}
          </div>

          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl shadow-sm">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Email Notifications</h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Receive updates about your profile and activities</p>
              </div>
            </div>
            {!isEditing ? (
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${settings.notificationsEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700'}`}>
                {settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
              </label>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Password Change Card - Always Editable */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors hover:shadow-md dark:shadow-none">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            Change Password
          </h3>
        </div>
        <div className="p-8">
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Input 
              label="Current Password" 
              type="password" 
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            />
            <Input 
              label="New Password" 
              type="password" 
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            />
            <Input 
              label="Confirm New Password" 
              type="password" 
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            />
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" variant="secondary" className="font-bold shadow-sm">Update Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
