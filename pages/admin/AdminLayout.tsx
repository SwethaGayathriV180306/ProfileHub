import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, FileCheck, FileText, ShieldAlert, LogOut, Menu, School
} from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const AdminLayout: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-blue-900 dark:text-blue-400 p-4 flex justify-between items-center z-40 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 sticky top-0">
        <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
           <Logo className="w-8 h-8 text-blue-900 dark:text-blue-500" />
           Admin Portal
        </h1>
        <div className="flex items-center gap-4">
           <ThemeToggle />
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu className="text-slate-800 dark:text-slate-200" /></button>
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
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wider font-semibold pl-1">System Administrator</p>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-400">
                 {user?.name?.charAt(0)}
               </div>
               <div>
                 <p className="font-semibold text-sm text-slate-900 dark:text-white">{user?.name}</p>
                 <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online</p>
               </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { path: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { path: '/admin/students', label: 'Student Management', icon: Users },
              { path: '/admin/documents', label: 'Document Verification', icon: FileCheck },
              { path: '/admin/reports', label: 'Reports & Analytics', icon: FileText },
              { path: '/admin/audit', label: 'Security Audit Logs', icon: ShieldAlert },
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
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="hidden md:flex justify-end p-4 absolute top-6 right-8 z-30 pointer-events-none w-full max-w-7xl mx-auto">
          <div className="pointer-events-auto flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <ThemeToggle />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-24 h-full">
           <Outlet />
        </div>
      </main>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminLayout;