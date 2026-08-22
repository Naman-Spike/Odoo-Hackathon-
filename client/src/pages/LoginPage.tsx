import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, Shield, UserCheck, ArrowRight } from 'lucide-react';
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
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-zinc-900">
      {/* Light Crystal Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-50/70 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-zinc-100/80 blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white/80 border border-zinc-200/90 rounded-3xl shadow-liquid backdrop-blur-2xl overflow-hidden relative z-10 specular-highlight">
        
        {/* Left Branding Column */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-zinc-50 to-white/60 p-8 flex-col justify-between border-r border-zinc-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-mono mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>HRMS WORKSPACE</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-sm">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-zinc-900 tracking-tight font-sans">Dayflow</span>
            </div>

            <h2 className="text-xl font-extrabold text-zinc-900 leading-snug mb-3 tracking-tight">
              Pure minimalist workforce architecture.
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-medium">
              Precision timecard telemetry, quota balance orchestration, and automated compensation ledgers.
            </p>

            <div className="space-y-2.5 font-mono text-[11px]">
              {[
                'Digital Timecard Stopwatch',
                'Leave Quota Telemetry',
                'Compensation Ledger & Slips',
                'Admin Executive Console'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 text-[10px] font-mono text-zinc-400">
            DAYFLOW CORE • WHITE CRYSTAL EDITION
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white/70 backdrop-blur-xl">
          <div className="mb-6">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-xl bg-black flex items-center justify-center text-white">
                <Zap className="h-3.5 w-3.5 fill-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 font-sans">Dayflow</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Authentication</h2>
            <p className="text-xs text-zinc-500 mt-1">Sign in to your organization workspace</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@dayflow.com"
              required
            />

            <div className="relative">
              <Input
                label="Security Key / Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[32px] text-zinc-400 hover:text-zinc-700 focus:outline-none p-1 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full h-11 text-xs mt-2" isLoading={isLoading}>
              <span>Enter Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-zinc-200">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2.5">
              1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@dayflow.com', 'Admin@123')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100 hover:border-zinc-300 text-left transition-all group cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-black">
                  <Shield className="w-3.5 h-3.5 text-zinc-500" />
                  <span>HR Admin</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">admin@dayflow.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('employee@dayflow.com', 'User@123')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100 hover:border-zinc-300 text-left transition-all group cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-black">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Staff Member</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">employee@dayflow.com</div>
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-zinc-500">
            Need an account?{' '}
            <Link to="/signup" className="font-bold text-zinc-900 hover:underline">
              Register New Personnel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
