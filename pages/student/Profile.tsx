import React, { useState, useEffect } from 'react';
import { student } from '../../services/api';
import { StudentProfile } from '../../types';
import { ProfileHeader } from '../../components/student/profile/ProfileHeader';
import { PersonalSection } from '../../components/student/profile/PersonalSection';
import { ContactSection } from '../../components/student/profile/ContactSection';
import { AcademicSection } from '../../components/student/profile/AcademicSection';
import { SocialSection } from '../../components/student/profile/SocialSection';
import { AccountSection } from '../../components/student/profile/AccountSection';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await student.getProfile();
      setProfile(data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch profile', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<StudentProfile>) => {
    if (!profile) return;
    try {
      const { data } = await student.updateProfile({ ...profile, ...updatedData });
      setProfile(data);
      // Show success toast
      setToastMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setToastMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      setTimeout(() => setToastMessage(null), 3000);
      throw error; // Re-throw to let child components handle error state if needed
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        const { data } = await student.uploadProfilePhoto(formData);
        
        setProfile({ ...profile, profilePhoto: data.profilePhoto });
        setToastMessage({ type: 'success', text: 'Profile photo updated successfully!' });
        setTimeout(() => setToastMessage(null), 3000);
      } catch (error) {
        console.error('Failed to upload profile photo', error);
        setToastMessage({ type: 'error', text: 'Failed to upload photo. Please try again.' });
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) return <div>Failed to load profile.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 max-w-sm px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-opacity duration-300 z-50 ${
          toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toastMessage.text}
        </div>
      )}

      <ProfileHeader profile={profile} onPhotoUpload={handlePhotoUpload} />
      
      <div className="grid grid-cols-1 gap-6">
        <PersonalSection profile={profile} onUpdate={handleUpdateProfile} />
        <ContactSection profile={profile} onUpdate={handleUpdateProfile} />
        <AcademicSection profile={profile} onUpdate={handleUpdateProfile} />
        <SocialSection profile={profile} onUpdate={handleUpdateProfile} />
        <AccountSection profile={profile} onUpdate={handleUpdateProfile} />
      </div>
    </div>
  );
};

export default Profile;
