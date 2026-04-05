import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Role, DEPARTMENTS } from '../types';
import { auth } from '../services/api';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', // Roll No
    department: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    year: '1',
    semester: 'Semester - I'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email.endsWith('@bitsathy.ac.in')) return "Email must match @bitsathy.ac.in domain";
    if (!/^\d{10}$/.test(formData.phone)) return "Phone number must be exactly 10 digits";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await auth.register({
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: Role.STUDENT,
        department: formData.department,
        year: formData.year,
        semester: formData.semester,
        gender: formData.gender,
        phone: formData.phone
      });

      localStorage.setItem('token', res.data.token);
      login(res.data.user); // Assuming API returns user object in response
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] fixed h-screen relative bg-blue-900 overflow-hidden items-center justify-center isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"></div>
        {/* Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] bg-blue-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/30 rounded-full blur-[100px]"></div>
        
        {/* Glassmorphism Logo Showcase */}
        <div className="relative z-10 p-12 flex flex-col items-center text-center">
          <div className="h-28 w-28 bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 mb-8 shadow-2xl flex items-center justify-center">
            <Logo className="h-full w-full" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Join ProfileHub
          </h1>
          <p className="text-blue-100/90 text-lg font-medium max-w-sm drop-shadow">
            Create your account to start managing your academic portfolio and career placements.
          </p>
        </div>
      </div>

      {/* Right Side: Registration Form (Offset to account for fixed left side on desktop, or normal flow) */}
      <div className="w-full md:w-[55%] lg:w-[60%] md:ml-auto flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-screen">
        
        <div className="w-full max-w-2xl space-y-10">
          
          {/* Mobile Only Header */}
          <div className="md:hidden text-center mb-8">
            <div className="mx-auto h-16 w-16 text-blue-900 dark:text-blue-500 mb-4">
              <Logo className="h-full w-full" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">ProfileHub</h2>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create an account</h2>
            <p className="text-slate-500 dark:text-slate-300">Fill out the details below as a student to get started.</p>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <Input label="Full Name" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
              <Input label="Roll Number" name="username" required value={formData.username} onChange={handleChange} placeholder="e.g. 7376..." />
              
              <div className="md:col-span-2">
                <Input label="College Email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="username@bitsathy.ac.in" />
              </div>
              
              <Input label="Phone Number" type="tel" name="phone" required value={formData.phone} onChange={handleChange} maxLength={10} placeholder="10 digit number" />
              <Select label="Gender" name="gender" required value={formData.gender} onChange={handleChange}
                options={[{value:'Male', label:'Male'},{value:'Female', label:'Female'},{value:'Other', label:'Other'}]}
              />

              <div className="md:col-span-2">
                <Select label="Department" name="department" required value={formData.department} onChange={handleChange}
                  options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                />
              </div>

              <Select label="Batch / Year" name="year" required value={formData.year} onChange={handleChange}
                options={[{value:'1', label:'1st Year'},{value:'2', label:'2nd Year'},{value:'3', label:'3rd Year'},{value:'4', label:'4th Year'}]}
              />
              <Select label="Current Semester" name="semester" required value={formData.semester} onChange={handleChange}
                options={[
                  {value:'Semester - I', label:'Semester - I'},
                  {value:'Semester - II', label:'Semester - II'},
                  {value:'Semester - III', label:'Semester - III'},
                  {value:'Semester - IV', label:'Semester - IV'},
                  {value:'Semester - V', label:'Semester - V'},
                  {value:'Semester - VI', label:'Semester - VI'},
                  {value:'Semester - VII', label:'Semester - VII'},
                  {value:'Semester - VIII', label:'Semester - VIII'},
                ]}
              />

              <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
              <Input label="Confirm Password" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
              <Button type="button" variant="ghost" className="w-full sm:w-1/3" onClick={() => navigate('/login')}>
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-2/3 h-12 text-base font-bold shadow-lg shadow-blue-600/20" isLoading={loading}>
                Register Account
              </Button>
            </div>
            
            <div className="text-center text-sm pt-4">
              <span className="text-slate-500 dark:text-slate-300">Already have an account? </span>
              <button type="button" onClick={() => navigate('/login')} className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;