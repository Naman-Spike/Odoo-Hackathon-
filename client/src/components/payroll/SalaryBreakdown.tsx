import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar } from 'lucide-react';

interface SalaryBreakdownProps {
  payroll: any;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({ payroll }) => {
  const totalEarnings = payroll.basicSalary + payroll.allowances;
  const totalDeductions = payroll.deductions;
  
  const basicPct = Math.round((payroll.basicSalary / totalEarnings) * 100) || 0;
  const allowPct = Math.round((payroll.allowances / totalEarnings) * 100) || 0;

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Salary Structure</h3>
          <p className="text-blue-100 text-sm flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" /> Effective from {formatDate(payroll.effectiveDate)}
          </p>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Earnings</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-medium">{formatCurrency(payroll.basicSalary)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Allowances</span>
                <span className="font-medium">{formatCurrency(payroll.allowances)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t font-semibold text-gray-900">
                <span>Gross Earnings</span>
                <span>{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div style={{ width: `${basicPct}%` }} className="bg-blue-500 h-full" title="Basic Salary" />
                <div style={{ width: `${allowPct}%` }} className="bg-indigo-400 h-full" title="Allowances" />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Basic</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400" /> Allowances</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Deductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Standard Deductions & Taxes</span>
                <span className="font-medium text-red-600">{formatCurrency(payroll.deductions)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t font-semibold text-gray-900">
                <span>Total Deductions</span>
                <span className="text-red-600">{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Net Salary / Take Home</h4>
            <p className="text-xs text-gray-400 mt-1">(Gross Earnings - Total Deductions)</p>
          </div>
          <div className="text-4xl font-bold text-green-600 mt-2 md:mt-0">
            {formatCurrency(payroll.netSalary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
