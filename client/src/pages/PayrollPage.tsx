import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SalaryBreakdown } from '../components/payroll/SalaryBreakdown';
import { SalarySlip } from '../components/payroll/SalarySlip';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { FileText, AlertCircle, Printer, Wallet } from 'lucide-react';

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
          setError('Payroll not yet configured for your account.');
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
      <div className="flex h-[60vh] items-center justify-center text-slate-400 text-xs font-semibold">
        Loading salary structure...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-amber-50 border border-amber-200 rounded-3xl p-8 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-base font-bold text-amber-900 mb-1">Payroll Setup Pending</h2>
        <p className="text-xs text-amber-700 max-w-sm">{error}</p>
        <p className="text-[11px] text-amber-600 mt-4">Please request your HR Manager or System Administrator to configure your basic salary and allowances.</p>
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
          <h1 className="text-2xl font-extrabold text-slate-900">Compensation & Payslips</h1>
          <p className="text-xs text-slate-500 mt-0.5">View your current salary package, deductions, and print monthly payslips</p>
        </div>
        <Button onClick={() => setIsSlipOpen(true)} variant="gradient" icon={Printer}>
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
