import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SalaryBreakdown } from '../components/payroll/SalaryBreakdown';
import { SalarySlip } from '../components/payroll/SalarySlip';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { FileText, AlertCircle } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading payroll details...</div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Payroll Unavailable</h2>
        <p className="text-yellow-700">{error}</p>
        <p className="text-sm text-yellow-600 mt-4">Please contact HR or your administrator to set up your salary details.</p>
      </div>
    );
  }

  const employeeData = {
    name: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Employee',
    employeeId: user?.employeeId,
    department: user?.profile?.department,
    designation: user?.profile?.designation,
    email: user?.email
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Compensation</h1>
        <Button onClick={() => setIsSlipOpen(true)} icon={FileText}>
          View Salary Slip
        </Button>
      </div>

      <SalaryBreakdown payroll={payroll} />

      <Modal isOpen={isSlipOpen} onClose={() => setIsSlipOpen(false)} title="Salary Slip" size="lg">
        <SalarySlip payroll={payroll} employee={employeeData} />
      </Modal>
    </div>
  );
};

export default PayrollPage;
