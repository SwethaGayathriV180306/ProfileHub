import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { student as studentApi } from '../../services/api';
import { StudentProfile, Education, Project, Skill } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Plus, Trash2, Code, BookOpen, Layers } from 'lucide-react';

const EducationPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Form States
  const [newEdu, setNewEdu] = useState<Partial<Education>>({ level: 'UG' });
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState<Partial<Project>>({});

  useEffect(() => {
    if (user) {
      studentApi.getProfile()
        .then(res => setProfile(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const save = async (updatedProfile: StudentProfile) => {
    try {
      const res = await studentApi.updateProfile(updatedProfile);
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  // Education Handlers
  const addEducation = () => {
    if (!profile || !newEdu.institution || !newEdu.year) return;
    const edu: Education = {
      id: `edu-${Date.now()}`,
      level: newEdu.level as any,
      institution: newEdu.institution,
      year: newEdu.year,
      percentage: newEdu.percentage || ''
    };
    save({ ...profile, education: [...profile.education, edu] });
    setNewEdu({ level: 'UG', institution: '', year: '', percentage: '' });
  };

  const removeEducation = (id: string) => {
    if (!profile) return;
    save({ ...profile, education: profile.education.filter(e => e.id !== id) });
  };

  // Skill Handlers
  const addSkill = () => {
    if (!profile || !newSkill.trim()) return;
    const skill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkill,
      category: 'Programming Languages',
      proficiency: 'Beginner'
    };
    save({ ...profile, skills: [...profile.skills, skill] });
    setNewSkill('');
  };

  const removeSkill = (id: string) => {
    if (!profile) return;
    save({ ...profile, skills: profile.skills.filter(s => s.id !== id) });
  };

  // Project Handlers
  const addProject = () => {
    if (!profile || !newProject.title) return;
    const proj: Project = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      description: newProject.description || '',
      techStack: newProject.techStack || '',
      link: newProject.link || ''
    };
    save({ ...profile, projects: [...profile.projects, proj] });
    setNewProject({ title: '', description: '', techStack: '', link: '' });
  };

  const removeProject = (id: string) => {
    if (!profile) return;
    save({ ...profile, projects: profile.projects.filter(p => p.id !== id) });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Education & Skills</h1>
         <p className="text-gray-500 dark:text-gray-400">Manage your academic details and technical competencies.</p>
      </div>

      {/* Education Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" /> Academic History
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
           <div className="md:col-span-1">
             <Select 
               options={[{value:'10th', label:'10th'},{value:'12th', label:'12th'},{value:'UG', label:'Undergraduate'},{value:'PG', label:'Postgraduate'}]} 
               value={newEdu.level}
               onChange={e => setNewEdu({...newEdu, level: e.target.value as any})}
               className="bg-white dark:bg-slate-900"
             />
           </div>
           <div className="md:col-span-2">
             <Input placeholder="Institution Name" value={newEdu.institution || ''} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} className="bg-white dark:bg-slate-900" />
           </div>
           <div className="md:col-span-1">
             <Input placeholder="Year" value={newEdu.year || ''} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="bg-white dark:bg-slate-900" />
           </div>
           <div className="md:col-span-1 flex gap-2">
             <Input placeholder="%" value={newEdu.percentage || ''} onChange={e => setNewEdu({...newEdu, percentage: e.target.value})} className="bg-white dark:bg-slate-900" />
             <Button size="sm" onClick={addEducation}><Plus /></Button>
           </div>
        </div>

        <div className="space-y-3">
          {profile.education.map(edu => (
            <div key={edu.id} className="flex justify-between items-center p-3 border dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{edu.level} - {edu.institution}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passed: {edu.year} • Score: {edu.percentage}%</p>
              </div>
              <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {profile.education.length === 0 && <p className="text-center text-gray-400 dark:text-gray-500 py-4">No education details added.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" /> Skills
          </h2>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Add a skill (e.g. React, Python)" 
              value={newSkill} 
              onChange={e => setNewSkill(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                {skill.name}
                <button onClick={() => removeSkill(skill.id)} className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"><XIcon /></button>
              </span>
            ))}
            {profile.skills.length === 0 && <p className="text-gray-400 dark:text-gray-500">No skills added.</p>}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" /> Projects
          </h2>
          <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4 space-y-3">
            <Input placeholder="Project Title" value={newProject.title || ''} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-white dark:bg-slate-900" />
            <Input placeholder="Tech Stack (comma separated)" value={newProject.techStack || ''} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className="bg-white dark:bg-slate-900" />
            <Input placeholder="Description" value={newProject.description || ''} onChange={e => setNewProject({...newProject, description: e.target.value})} className="bg-white dark:bg-slate-900" />
            <Button onClick={addProject} className="w-full">Add Project</Button>
          </div>
          
          <div className="space-y-4">
             {profile.projects.map(proj => (
               <div key={proj.id} className="p-3 border dark:border-slate-800 rounded-lg">
                 <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-gray-800 dark:text-white">{proj.title}</h4>
                   <button onClick={() => removeProject(proj.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
                 <p className="text-xs text-blue-600 mb-1">{proj.techStack}</p>
                 <p className="text-sm text-gray-600 dark:text-gray-400">{proj.description}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default EducationPage;