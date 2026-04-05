import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { student } from '../services/api';
import { User, MapPin, Mail, Phone, Linkedin, Github, Globe, Download, Share2, Award, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username]);

  const fetchProfile = async (u: string) => {
    try {
      const response = await student.getPublicProfile(u);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch public profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Profile...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-slate-500">Profile not found.</div>;

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-900 to-blue-700 relative">
        <div className="absolute -bottom-16 left-8 md:left-16">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-blue-900">
             {profile.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
            <p className="text-lg text-slate-600 font-medium">{profile.department} Student • Class of {profile.year}</p>
            <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
              {profile.currentAddress && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.currentAddress}</span>}
              {/* Email/Phone hidden for privacy as per requirement, or shown if public */}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowQr(!showQr)}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" /> Resume
            </Button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQr && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQr(false)}>
            <div className="bg-white p-6 rounded-xl shadow-xl text-center" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">Scan to Share</h3>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-xs text-slate-500 break-all">{shareUrl}</p>
              <Button className="mt-4 w-full" onClick={() => setShowQr(false)}>Close</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Social Links */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Connect</h3>
              <div className="space-y-3">
                {profile.linkedInUrl && (
                  <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-blue-700 transition-colors">
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
                    <Github className="w-5 h-5" /> GitHub
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors">
                    <Globe className="w-5 h-5" /> Portfolio
                  </a>
                )}
                {!profile.linkedInUrl && !profile.githubUrl && !profile.portfolioUrl && (
                  <p className="text-sm text-slate-400 italic">No social links added.</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: any, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                      {skill.name || skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No skills listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            {profile.about && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> About
                </h3>
                <p className="text-slate-600 leading-relaxed">{profile.about}</p>
              </div>
            )}

            {/* Academic Highlights */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Academic Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">CGPA</p>
                    <p className="text-2xl font-bold text-emerald-600">{profile.cgpa || 'N/A'}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Profile Score</p>
                    <p className="text-2xl font-bold text-blue-600">{profile.profileCompleteness}%</p>
                 </div>
              </div>
            </div>

            {/* Projects Gallery (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Projects
              </h3>
              {profile.projects && profile.projects.length > 0 ? (
                <div className="space-y-4">
                  {profile.projects.map((project: any, index: number) => (
                    <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-slate-800">{project.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
                  <p>No projects showcased yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
