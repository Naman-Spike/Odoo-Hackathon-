import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { Printer, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface SalarySlipProps {
  payroll: any;
  employee: any;
}

export const SalarySlip: React.FC<SalarySlipProps> = ({ payroll, employee }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  const currentMonth = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" icon={Printer} onClick={handlePrint}>Print</Button>
      </div>

      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-3xl mx-auto print:p-0 print:border-none print:shadow-none" id="salary-slip">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">Dayflow Technologies</h1>
          <p className="text-sm text-gray-500">123 Business Avenue, Tech District, City</p>
          <h2 className="text-xl font-semibold mt-4 text-blue-800">Payslip for {currentMonth}</h2>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="font-semibold text-gray-700">Employee Name:</span>
            <span className="text-gray-900">{employee.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="font-semibold text-gray-700">Employee ID:</span>
            <span className="text-gray-900">{employee.employeeId}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="font-semibold text-gray-700">Designation:</span>
            <span className="text-gray-900">{employee.designation || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="font-semibold text-gray-700">Department:</span>
            <span className="text-gray-900">{employee.department || 'N/A'}</span>
          </div>
        </div>

        {/* Salary Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="font-bold text-gray-800 bg-gray-100 px-3 py-2 mb-3">Earnings</h3>
            <div className="space-y-2 px-3 text-sm">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span>{formatCurrency(payroll.basicSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances</span>
                <span>{formatCurrency(payroll.allowances)}</span>
              </div>
            </div>
            <div className="mt-4 border-t-2 border-gray-200 pt-2 px-3 flex justify-between font-bold">
              <span>Total Earnings</span>
              <span>{formatCurrency(payroll.basicSalary + payroll.allowances)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-bold text-gray-800 bg-gray-100 px-3 py-2 mb-3">Deductions</h3>
            <div className="space-y-2 px-3 text-sm">
              <div className="flex justify-between">
                <span>Tax & Standard Deductions</span>
                <span>{formatCurrency(payroll.deductions)}</span>
              </div>
            </div>
            <div className="mt-4 border-t-2 border-gray-200 pt-2 px-3 flex justify-between font-bold">
              <span>Total Deductions</span>
              <span>{formatCurrency(payroll.deductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md flex justify-between items-center mb-12">
          <span className="text-lg font-bold text-gray-800">Net Pay for the Month</span>
          <span className="text-2xl font-bold text-green-700">{formatCurrency(payroll.netSalary)}</span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-12 border-t border-gray-200 pt-4">
          <p>This is a computer generated payslip and does not require a physical signature.</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
