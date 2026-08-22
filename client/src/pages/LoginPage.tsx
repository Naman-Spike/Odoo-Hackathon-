import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, Shield, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
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
      {/* Liquid Glass Dynamic Ambient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sky-100/60 via-indigo-100/50 to-transparent blur-[140px] pointer-events-none animate-liquid-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-teal-50/60 via-slate-100/70 to-transparent blur-[150px] pointer-events-none animate-liquid-pulse" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-br from-white/90 via-white/80 to-white/70 border border-white/95 rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12),inset_0_1.5px_1.5px_rgba(255,255,255,1)] backdrop-blur-3xl overflow-hidden relative z-10 specular-highlight">
        
        {/* Left Branding Column */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-white/60 via-zinc-50/40 to-white/50 p-8 flex-col justify-between border-r border-white/80 backdrop-blur-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-white/90 text-zinc-700 text-[11px] font-mono mb-8 shadow-sm backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>HRMS WORKSPACE</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.2)]">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-zinc-900 tracking-tight font-sans">Dayflow</span>
            </div>

            <h2 className="text-xl font-black text-zinc-900 leading-snug mb-3 tracking-tight font-sans">
              Liquid glass architecture for modern workforce teams.
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-medium">
              Precision timecard telemetry, quota balance orchestration, and automated compensation ledgers.
            </p>

            <div className="space-y-2.5 font-mono text-[11px]">
              {[
                'Digital Timecard Stopwatch',
                'Visual Analytics & Intelligence',
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

          <div className="pt-6 border-t border-white/80 font-mono text-[11px] text-zinc-400">
            Enterprise Grade • Odoo Hackathon Edition
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Sign In</h1>
            <p className="text-xs text-zinc-500 mt-1">Access your personnel portal and telemetry</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50/80 border border-rose-200/90 text-rose-700 text-xs font-medium rounded-2xl flex items-center gap-2 backdrop-blur-md font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. employee@dayflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <div className="relative">
                <Input
                  label="Security Key"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-9 text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-mono text-xs"
              isLoading={isLoading}
            >
              Authenticate Session
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-white/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                1-Click Quick Demo Login:
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Pre-seeded</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@dayflow.com', 'Admin@123')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 hover:bg-white border border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.02)] transition-all text-left cursor-pointer group backdrop-blur-xl"
              >
                <div className="p-2 rounded-xl bg-black text-white group-hover:scale-105 transition-transform flex-shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 group-hover:text-black">HR Admin</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">admin@dayflow.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('employee@dayflow.com', 'User@123')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 hover:bg-white border border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.02)] transition-all text-left cursor-pointer group backdrop-blur-xl"
              >
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 group-hover:scale-105 transition-transform flex-shrink-0 border border-zinc-200">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 group-hover:text-black">Staff Member</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">employee@dayflow.com</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500">
            Need an account?{' '}
            <Link to="/signup" className="font-bold text-zinc-900 hover:underline">
              Register Credentials
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
