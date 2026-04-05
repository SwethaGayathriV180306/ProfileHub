import React from 'react';
import { Camera, Edit } from 'lucide-react';
import { StudentProfile } from '../../../types';

interface ProfileHeaderProps {
  profile: StudentProfile;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onPhotoUpload }) => {
  const completionColor = profile.profileCompleteness >= 80 ? 'text-emerald-500' : profile.profileCompleteness >= 50 ? 'text-yellow-500' : 'text-red-500';
  const strokeColor = profile.profileCompleteness >= 80 ? '#10b981' : profile.profileCompleteness >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-colors group relative">
      {/* Decorative Cover Gradient */}
      <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[40px]"></div>
      </div>
      
      <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative">
        {/* Profile Photo Interactive */}
        <div className="relative shrink-0 group/photo -mt-16 z-10">
          <div className="h-32 w-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-xl relative transition-all duration-300 group-hover/photo:shadow-blue-500/20 group-hover/photo:-translate-y-1">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Camera className="w-10 h-10" />
              </div>
            )}
            {/* Hover overlay for upload */}
            <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-20 backdrop-blur-sm">
              <Camera className="w-8 h-8 mb-1 translate-y-2 group-hover/photo:translate-y-0 transition-transform duration-300" />
              <span className="text-xs font-bold">Update</span>
              <input type="file" className="hidden" accept="image/*" onChange={onPhotoUpload} />
            </label>
          </div>
        </div>

        {/* Basic Info & Actions */}
        <div className="flex-1 text-center md:text-left pt-2 pb-2 flex flex-col md:flex-row justify-between items-center md:items-end w-full">
           <div>
             <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{profile.fullName}</h1>
             <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-3">{profile.department}</p>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm">
               <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800 font-bold shadow-sm">{profile.username}</span>
               <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-semibold">{profile.year} Year</span>
               <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-semibold">{profile.gender}</span>
             </div>
           </div>

           {/* Completion Stats Ring */}
           <div className="mt-6 md:mt-0 flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <div className="relative h-16 w-16 flex items-center justify-center drop-shadow-md">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="6" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke={strokeColor} strokeWidth="6" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * profile.profileCompleteness) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <span className={`absolute text-sm font-black ${completionColor}`}>{profile.profileCompleteness}%</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-0.5">Profile Strength</p>
                <p className={`text-sm font-black ${completionColor}`}>{profile.profileCompleteness === 100 ? 'All-Star' : 'Intermediate'}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
