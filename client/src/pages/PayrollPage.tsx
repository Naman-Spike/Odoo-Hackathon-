import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SalaryBreakdown } from '../components/payroll/SalaryBreakdown';
import { SalarySlip } from '../components/payroll/SalarySlip';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { AlertCircle, Printer } from 'lucide-react';

export const PayrollPage = () => {
  const { user } = useAuth();
  const [payroll, setPayroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await api.get('/payroll/my');
        setPayroll(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Payroll structure not yet configured for this account.');
        } else {
          setError('Failed to fetch payroll information.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-zinc-500 text-xs font-mono">
        Loading compensation structure...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-liquid">
        <AlertCircle className="w-10 h-10 text-zinc-500 mb-3" />
        <h2 className="text-sm font-bold text-white mb-1 font-sans">Payroll Setup Pending</h2>
        <p className="text-xs text-zinc-400 max-w-sm font-mono">{error}</p>
        <p className="text-[11px] text-zinc-500 mt-4 font-mono">Contact your HR Manager or System Administrator to configure your compensation tier.</p>
      </div>
    );
  }

  const employeeData = {
    name: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Employee',
    employeeId: user?.employeeId || 'EMP-002',
    department: user?.profile?.department || 'Engineering',
    designation: user?.profile?.designation || 'Software Developer',
    email: user?.email
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">Compensation & Payslips</h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">Audit your salary package, tax deductions, and print monthly statements</p>
        </div>
        <Button onClick={() => setIsSlipOpen(true)} variant="primary" icon={Printer}>
          Generate Payslip
        </Button>
      </div>

      <SalaryBreakdown payroll={payroll} />

      <Modal isOpen={isSlipOpen} onClose={() => setIsSlipOpen(false)} title="Employee Salary Slip" size="xl">
        <SalarySlip payroll={payroll} employee={employeeData} />
      </Modal>
    </div>
  );
};

export default PayrollPage;
