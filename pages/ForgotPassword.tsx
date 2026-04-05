import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { auth } from '../services/api';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (email.includes('@') && !email.endsWith('@bitsathy.ac.in')) {
      setError('Please use a valid @bitsathy.ac.in email address.');
      setLoading(false);
      return;
    }

    try {
      await auth.forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'No user found with this email/username.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      setStep(3);
    } else {
      setError('Please enter the 4-digit OTP.');
    }
  };

  const handleResetPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await auth.resetPassword({ email, otp, newPassword: newPass });
      alert('Password reset successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] relative bg-blue-900 overflow-hidden items-center justify-center isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"></div>
        {/* Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] bg-blue-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/30 rounded-full blur-[100px]"></div>
        
        {/* Glassmorphism Logo Showcase */}
        <div className="relative z-10 p-12 flex flex-col items-center text-center">
          <div className="h-28 w-28 bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 mb-8 shadow-2xl flex items-center justify-center">
            <Mail className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Account Recovery
          </h1>
          <p className="text-blue-100/90 text-lg font-medium max-w-sm drop-shadow">
            Regain access to your ProfileHub academic ecosystem securely.
          </p>
        </div>
      </div>

      {/* Right Side: Recovery Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-slate-50 dark:bg-slate-950 transition-colors">
        
        <div className="w-full max-w-md space-y-10">
          
          <button onClick={() => navigate('/login')} className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Login
          </button>

          <div className="space-y-3">
             <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-800">
               <KeyRound className="w-6 h-6 text-blue-700 dark:text-blue-400" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reset Password</h2>
             <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
               {step === 1 && "Enter your college email or username, and we'll send you an OTP to quickly restore access."}
               {step === 2 && "We've sent a 4-digit code to your email. Enter it below to verify your identity."}
               {step === 3 && "Secure your account with a new, strong password."}
             </p>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 font-medium tracking-wide">
              {error}
            </div>
          )}

          <div className="mt-8">
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <Input 
                  label="Email or Username" 
                  placeholder="username or email@bitsathy.ac.in" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20" isLoading={loading}>
                  Send Recovery OTP
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <Input 
                  label="Enter OTP" 
                  placeholder="XXXX" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  required 
                  className="tracking-widest text-center text-xl uppercase font-mono"
                  maxLength={4}
                />
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20">
                  Verify OTP
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPass} className="space-y-6">
                <Input 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPass} 
                  onChange={e => setNewPass(e.target.value)} 
                  required 
                />
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20">
                  Set New Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;