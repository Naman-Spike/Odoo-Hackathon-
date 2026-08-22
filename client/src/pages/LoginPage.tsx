import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, Shield, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        
        {/* Left Visual Branding Panel (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-950 p-8 flex-col justify-between border-r border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Generation HRMS Platform
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
                <Zap className="h-6 w-6 fill-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Dayflow</span>
            </div>

            <h2 className="text-xl font-bold text-white leading-snug mb-3">
              Streamline attendance, leaves, and payroll seamlessly.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Empowering organizations with real-time workforce tracking, automated payroll calculations, and intuitive team management.
            </p>

            <div className="space-y-2.5">
              {[
                'One-click Attendance Timer',
                'Automated Leave Quota Validation',
                'Comprehensive Payroll & Slips',
                'Role-Based Admin Console'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500">
            Dayflow HRMS • Odoo Hackathon Edition
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-slate-900">Dayflow</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to your Dayflow workspace</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@dayflow.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2" />
                Keep me signed in
              </label>
              <span className="text-indigo-600 hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-11 text-sm mt-2" isLoading={isLoading}>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Quick Demo Logins (Click to Autofill)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@dayflow.com', 'Admin@123')}
                className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 group-hover:text-indigo-700">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>HR Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">admin@dayflow.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('employee@dayflow.com', 'User@123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Employee</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">employee@dayflow.com</div>
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
