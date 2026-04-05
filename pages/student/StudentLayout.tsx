import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { student as studentApi } from '../../services/api';
import { Notification, StudentProfile } from '../../types';
import { 
  User, FileText, Briefcase, LayoutDashboard, LogOut, Menu, X, Bell, CheckCircle, AlertCircle, Info, Home, BarChart2
} from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const StudentLayout: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [notifRes, profileRes] = await Promise.all([
            studentApi.getNotifications(),
            studentApi.getProfile()
          ]);
          setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
          setProfile(profileRes.data);
        } catch (error: any) {
          if (error.response?.status === 401) return;
          console.error("Failed to fetch data", error);
        }
      };

      fetchData();
      const interval = setInterval(async () => {
        try {
           const res = await studentApi.getNotifications();
           setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (e: any) { 
          if (e.response?.status !== 401) console.error(e); 
        }
      }, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await studentApi.markNotificationsRead();
      setNotifications(prev => Array.isArray(prev) ? prev.map(n => ({ ...n, isRead: true })) : []);
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Mobile Header - Glassmorphism */}
      <div className="md:hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-blue-900 dark:text-blue-400 p-4 flex justify-between items-center z-40 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 sticky top-0">
        <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
           <Logo className="w-8 h-8 text-blue-900 dark:text-blue-500" />
           ProfileHub
        </h1>
        <div className="flex items-center gap-4">
           <ThemeToggle />
           <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1">
             <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
             {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>}
           </button>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu className="text-slate-800 dark:text-slate-200"/></button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-2xl md:shadow-none transform transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800/50
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight text-blue-900 dark:text-blue-400">
              <Logo className="w-8 h-8 text-blue-900 dark:text-blue-500" />
              ProfileHub
            </h1>
          </div>

          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-900 dark:text-blue-400 border border-blue-200 dark:border-blue-800 overflow-hidden shrink-0">
                {profile?.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold truncate text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.username}</p>
              </div>
            </div>
            {profile && (
               <div className="mt-4">
                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                   <span>Profile Completeness</span>
                   <span className="text-blue-700 dark:text-blue-400 font-bold">{profile.profileCompleteness || 0}%</span>
                 </div>
                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                   <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${profile.profileCompleteness || 0}%` }}></div>
                 </div>
               </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { path: '/student/dashboard', label: 'Dashboard', icon: Home },
              { path: '/student/profile', label: 'Profile Management', icon: User },
              { path: '/student/education', label: 'Education & Skills', icon: Briefcase },
              { path: '/student/placements', label: 'Placements & Internships', icon: Briefcase },
              { path: '/student/analytics', label: 'Analytics', icon: BarChart2 },
              { path: '/student/documents', label: 'Documents & Uploads', icon: FileText },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-1'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 hover:translate-x-1'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 transition-colors ${ ({isActive}:any) => isActive ? 'text-white' : 'text-slate-400' }`} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Desktop Header Actions - Floating Glass Pill */}
        <div className="hidden md:flex justify-end p-4 absolute top-6 right-8 z-30 pointer-events-none w-full max-w-7xl mx-auto">
          <div className="pointer-events-auto flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50" ref={notifRef}>
            <ThemeToggle />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="relative flex items-center">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                   {unreadCount}
                 </span>
               )}
             </button>

               {/* Dropdown */}
               {showNotifications && (
                 <div className="absolute right-0 top-12 mt-2 w-96 bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden z-50 animate-fade-in-down">
                   <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                     <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                     {unreadCount > 0 && (
                       <button onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                         Mark all read
                       </button>
                     )}
                   </div>
                   <div className="max-h-96 overflow-y-auto">
                     {!Array.isArray(notifications) || notifications.length === 0 ? (
                       <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                         <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                         <p className="text-sm">No new notifications</p>
                       </div>
                     ) : (
                       <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                         {notifications.map((notif) => (
                           <li key={notif._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                             <div className="flex gap-3">
                               <div className="mt-0.5">
                                 {notif.type === 'SUCCESS' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                 {notif.type === 'ERROR' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                 {notif.type === 'INFO' && <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
                               </div>
                               <div>
                                 <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                               </div>
                             </div>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-24 h-full">
           <Outlet />
        </div>
      </main>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-0 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default StudentLayout;
