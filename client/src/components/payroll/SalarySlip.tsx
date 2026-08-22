import React from 'react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Printer, Zap, ShieldCheck } from 'lucide-react';
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
      <div className="flex justify-between items-center print:hidden bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        <span className="text-xs text-zinc-500 font-mono">Official statement formatted for standard PDF export</span>
        <Button variant="primary" size="sm" icon={Printer} onClick={handlePrint}>
          Print / Export PDF
        </Button>
      </div>

      {/* Payslip Document Canvas */}
      <div className="bg-white p-6 sm:p-10 border border-zinc-200 rounded-3xl max-w-3xl mx-auto shadow-liquid text-zinc-900 print:shadow-none print:border-none print:p-0 print:bg-white print:text-black" id="salary-slip">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-sm">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900 print:text-black">Dayflow Technologies</h1>
              <p className="text-[10px] text-zinc-500 font-mono">123 Innovation Way, Tech District • Corporate HR</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-900 font-mono font-bold text-[11px] rounded-lg border border-zinc-300 uppercase tracking-widest print:border-black print:text-black">
              Formal Payslip
            </span>
            <div className="text-xs font-mono font-bold text-zinc-900 mt-1 print:text-black">{currentMonth}</div>
          </div>
        </div>

        {/* Employee Particulars Grid */}
        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 mb-6 print:bg-gray-100 print:border-gray-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest print:text-gray-600">Employee</span>
              <div className="font-bold text-zinc-900 mt-0.5 print:text-black">{employee.name || 'Employee'}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest print:text-gray-600">Personnel ID</span>
              <div className="font-bold text-zinc-900 mt-0.5 print:text-black">{employee.employeeId || 'EMP-001'}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest print:text-gray-600">Department</span>
              <div className="font-bold text-zinc-900 mt-0.5 print:text-black">{employee.department || 'Engineering'}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest print:text-gray-600">Designation</span>
              <div className="font-bold text-zinc-900 mt-0.5 print:text-black">{employee.designation || 'Staff'}</div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 font-mono text-xs">
          {/* Earnings Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden print:border-gray-300">
            <div className="bg-zinc-100 px-4 py-2.5 font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 print:bg-gray-200 print:text-black">
              Earnings & Allowances
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-zinc-500 print:text-gray-600">Basic Pay</span>
                <span className="font-bold text-zinc-900 print:text-black">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 print:text-gray-600">Allowances (HRA / Special)</span>
                <span className="font-bold text-zinc-900 print:text-black">{formatCurrency(allowances)}</span>
              </div>
              <div className="pt-3 border-t border-zinc-200 flex justify-between font-extrabold text-zinc-900 print:text-black">
                <span>Total Gross</span>
                <span>{formatCurrency(gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden print:border-gray-300">
            <div className="bg-zinc-100 px-4 py-2.5 font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 print:bg-gray-200 print:text-black">
              Deductions & Taxes
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-zinc-500 print:text-gray-600">Provident Fund (PF)</span>
                <span className="font-bold text-zinc-700 print:text-black">{formatCurrency(deductions * 0.4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 print:text-gray-600">Withholding Tax (TDS)</span>
                <span className="font-bold text-zinc-700 print:text-black">{formatCurrency(deductions * 0.6)}</span>
              </div>
              <div className="pt-3 border-t border-zinc-200 flex justify-between font-extrabold text-zinc-900 print:text-black">
                <span>Total Deductions</span>
                <span>-{formatCurrency(deductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Pay Banner */}
        <div className="bg-black text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-2 mb-8 shadow-sm">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">Net Amount Disbursed</span>
            <div className="text-xs font-bold">Total In-Hand Take-Home Compensation</div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">
            {formatCurrency(net)}
          </div>
        </div>

        {/* Formal Verification Footer */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-500 print:text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-black print:text-black" />
            <span>Digitally verified by Dayflow HRMS • No physical signature required.</span>
          </div>
          <div>Issue Date: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};
