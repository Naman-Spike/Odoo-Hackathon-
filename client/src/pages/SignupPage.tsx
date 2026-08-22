import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      {/* Light Crystal Ambient Light */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-50/70 blur-[140px] pointer-events-none" />
      
      <div className="max-w-lg w-full bg-white/85 rounded-3xl shadow-liquid p-6 sm:p-10 border border-zinc-200/90 relative z-10 backdrop-blur-2xl animate-slide-up specular-highlight">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-black text-white shadow-sm mb-4">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Personnel Onboarding</h2>
          <p className="text-xs text-zinc-500 mt-1">Register new organization credentials</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Staff ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP-003"
              required
            />
            <Select
              label="Assigned Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'EMPLOYEE', label: 'Employee (Standard)' },
                { value: 'ADMIN', label: 'HR Administrator' }
              ]}
            />
          </div>

          <Input
            label="Corporate Email"
            name="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="user@dayflow.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full h-11 text-xs mt-4" isLoading={isLoading}>
            <span>Initialize Account</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-zinc-900 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
