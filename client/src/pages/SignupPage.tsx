import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    employeeId: 'EMP-' + Math.floor(100 + Math.random() * 900),
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLOYEE'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Security key must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      await signup({
        employeeId: formData.employeeId,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initialize account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-zinc-900">
      {/* Liquid Glass Dynamic Ambient Blobs */}
      <div className="absolute top-1/3 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sky-100/60 via-indigo-100/50 to-transparent blur-[140px] pointer-events-none animate-liquid-float" />
      <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-teal-50/60 via-slate-100/70 to-transparent blur-[150px] pointer-events-none animate-liquid-pulse" />
      
      <div className="max-w-lg w-full bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12),inset_0_1.5px_1.5px_rgba(255,255,255,1)] p-6 sm:p-10 border border-white/95 relative z-10 backdrop-blur-3xl animate-slide-up specular-highlight">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.2)] mb-4">
            <Zap className="h-6 w-6 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Personnel Onboarding</h2>
          <p className="text-xs text-zinc-500 mt-1">Register new organization credentials</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-medium rounded-2xl flex items-center gap-2 backdrop-blur-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-medium rounded-2xl flex items-center gap-2 backdrop-blur-md font-mono">
            <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Assigned Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP-XXX"
              required
            />

            <Select
              label="Access Privilege Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'EMPLOYEE', label: 'Staff Member' },
                { value: 'ADMIN', label: 'HR Administrator' }
              ]}
              required
            />
          </div>

          <Input
            label="Corporate Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. name@dayflow.com"
            icon={Mail}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 font-mono text-xs"
            isLoading={isLoading}
          >
            Create Organization Profile
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          Already have credentials?{' '}
          <Link to="/login" className="font-bold text-zinc-900 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
