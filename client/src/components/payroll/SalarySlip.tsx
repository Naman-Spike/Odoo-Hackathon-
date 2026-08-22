import React from 'react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Printer, Download, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface SalarySlipProps {
  payroll: any;
  employee: any;
}

export const SalarySlip: React.FC<SalarySlipProps> = ({ payroll, employee }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  const currentMonth = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  const basic = payroll?.basicSalary || 0;
  const allowances = payroll?.allowances || 0;
  const deductions = payroll?.deductions || 0;
  const gross = basic + allowances;
  const net = payroll?.netSalary || (gross - deductions);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center print:hidden bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <span className="text-xs text-slate-500 font-medium">Click Print to save as PDF or physical print</span>
        <Button variant="gradient" size="sm" icon={Printer} onClick={handlePrint}>
          Print / Export Payslip
        </Button>
      </div>

      {/* Payslip Document Canvas */}
      <div className="bg-white p-6 sm:p-10 border border-slate-300 rounded-2xl max-w-3xl mx-auto shadow-sm text-slate-900 print:shadow-none print:border-none print:p-0" id="salary-slip">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-white">
              <Zap className="h-6 w-6 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Dayflow Technologies</h1>
              <p className="text-[11px] text-slate-500 font-mono">123 Innovation Way, Tech District • HR Department</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100 uppercase tracking-wider">
              Official Payslip
            </span>
            <div className="text-xs font-bold text-slate-900 mt-1 font-mono">{currentMonth}</div>
          </div>
        </div>

        {/* Employee Particulars Table */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</span>
              <div className="font-bold text-slate-900 mt-0.5">{employee.name || 'Employee'}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{employee.employeeId || 'EMP-001'}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
              <div className="font-bold text-slate-900 mt-0.5">{employee.department || 'Engineering'}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</span>
              <div className="font-bold text-slate-900 mt-0.5">{employee.designation || 'Staff'}</div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Earnings Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200">
              Earnings & Allowances
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Basic Pay Scale</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">House Rent / Special Allowances</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(allowances)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                <span>Total Gross Earnings</span>
                <span className="font-mono text-emerald-700">{formatCurrency(gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200">
              Deductions & Taxes
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Provident Fund (PF)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(deductions * 0.4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Income Tax (TDS)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(deductions * 0.6)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                <span>Total Deductions</span>
                <span className="font-mono text-rose-600">-{formatCurrency(deductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Pay Banner */}
        <div className="bg-slate-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-2 mb-8">
          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Net Amount Payable</span>
            <div className="text-sm font-semibold">Total Disbursed Take-Home Salary</div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {formatCurrency(net)}
          </div>
        </div>

        {/* Formal Document Verification Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Electronically verified and generated by Dayflow HRMS • No signature required.</span>
          </div>
          <div className="font-mono">Date: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};
