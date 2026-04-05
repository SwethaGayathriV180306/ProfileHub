import React, { useState } from 'react';
import { StudentProfile } from '../../../types';
import { SectionCard } from './SectionCard';
import { Input } from '../../ui/Input';
import { Github, Linkedin, Globe, Code } from 'lucide-react';

interface SocialSectionProps {
  profile: StudentProfile;
  onUpdate: (updatedData: Partial<StudentProfile>) => Promise<void>;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    website: profile.website || '',
    codingPlatformLinks: profile.codingPlatformLinks || []
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update social links', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Social & Professional Links"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => {
        setFormData({
          linkedin: profile.linkedin || '',
          github: profile.github || '',
          website: profile.website || '',
          codingPlatformLinks: profile.codingPlatformLinks || []
        });
        setIsEditing(false);
      }}
      loading={loading}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Linkedin className="w-3 h-3"/> LinkedIn</p>
            {formData.linkedin ? (
              <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                {formData.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ) : <p className="text-base font-semibold text-slate-900 dark:text-white">-</p>}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Github className="w-3 h-3"/> GitHub</p>
            {formData.github ? (
              <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                {formData.github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ) : <p className="text-base font-semibold text-slate-900 dark:text-white">-</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3"/> Portfolio Website</p>
            {formData.website ? (
              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                {formData.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ) : <p className="text-base font-semibold text-slate-900 dark:text-white">-</p>}
          </div>

          <div className="md:col-span-2 mt-4 border-t dark:border-slate-800/80 pt-6">
            <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2"><Code className="w-4 h-4 text-emerald-500"/> Coding Platforms</h4>
            {formData.codingPlatformLinks && formData.codingPlatformLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.codingPlatformLinks.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{link.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
               <p className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700/50">No coding platform links added yet.</p>
            )}
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <Input
              className="pl-10"
              label="LinkedIn URL"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-slate-800 dark:text-slate-300" />
            </div>
            <Input
              className="pl-10"
              label="GitHub URL"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <Input
              className="pl-10"
              label="Portfolio Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://your-portfolio.com"
            />
          </div>

          <div className="md:col-span-2 mt-4 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">Coding Platforms</h4>
            <div className="space-y-3">
              {formData.codingPlatformLinks.map((link, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                  <div className="flex-1">
                    <Input
                      placeholder="Platform (e.g. LeetCode)"
                      value={link.name}
                      onChange={(e) => {
                        const newLinks = [...formData.codingPlatformLinks];
                        newLinks[index].name = e.target.value;
                        setFormData({ ...formData, codingPlatformLinks: newLinks });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Profile URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.codingPlatformLinks];
                        newLinks[index].url = e.target.value;
                        setFormData({ ...formData, codingPlatformLinks: newLinks });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = formData.codingPlatformLinks.filter((_, i) => i !== index);
                      setFormData({ ...formData, codingPlatformLinks: newLinks });
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 rounded-full hover:bg-red-200 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Remove link"
                  >
                    <span className="font-bold text-xs leading-none">&#10005;</span>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  codingPlatformLinks: [...formData.codingPlatformLinks, { name: '', url: '' }]
                })}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold flex items-center gap-1 mt-4 px-4 py-2 border-2 border-dashed border-blue-200 dark:border-blue-800/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center"
              >
                + Add Platform Link
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
