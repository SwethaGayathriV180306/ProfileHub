import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Role, User } from '../types';
import { auth } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await auth.login({ username, password, role });
      localStorage.setItem('token', res.data.token);
      login(res.data.user);
      
      if (res.data.user.role === Role.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Left Side: Branding / Abstract Presentation (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 relative bg-blue-900 overflow-hidden items-center justify-center isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"></div>
        {/* Decorative Blur Orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/30 rounded-full blur-[100px]"></div>
        
        {/* Glassmorphism Logo Showcase */}
        <div className="relative z-10 p-12 flex flex-col items-center text-center">
          <div className="h-32 w-32 bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 mb-8 shadow-2xl flex items-center justify-center">
            <Logo className="h-full w-full" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md">
            ProfileHub
          </h1>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-slate-50 dark:bg-slate-950 transition-colors">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-10">
          {/* Mobile Only Header (hidden on desktop where left side exists) */}
          <div className="md:hidden text-center mb-10">
            <div className="mx-auto h-16 w-16 text-blue-900 dark:text-blue-500 mb-4">
               <Logo className="h-full w-full" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">ProfileHub</h2>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-300">Please enter your details to sign in.</p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-200/50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
             <button
              type="button"
              onClick={() => setRole(Role.STUDENT)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                role === Role.STUDENT ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100'
              }`}
            >
              Student
            </button>
             <button
              type="button"
              onClick={() => setRole(Role.ADMIN)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                role === Role.ADMIN ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100'
              }`}
            >
              Administrator
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div className="relative group">
                <UserIcon className="absolute top-9 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  label={role === Role.ADMIN ? "Username" : "Roll Number"}
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === Role.ADMIN ? "admin" : "Enter username"}
                  className="pl-11"
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute top-9 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-9 right-3.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded dark:bg-slate-800" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-300">Remember me</label>
              </div>
              {role === Role.STUDENT && (
                <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>

            {error && <div className="text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">{error}</div>}

            <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20" size="lg">
              Sign In
            </Button>

            {role === Role.STUDENT && (
              <div className="text-center text-sm mt-6">
                <span className="text-slate-500 dark:text-slate-300">Don't have an account? </span>
                <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                  Create Account
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;