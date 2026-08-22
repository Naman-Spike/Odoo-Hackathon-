import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface SalaryBreakdownProps {
  payroll: any;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({ payroll }) => {
  const basic = payroll?.basicSalary || 0;
  const allowances = payroll?.allowances || 0;
  const deductions = payroll?.deductions || 0;
  const totalEarnings = basic + allowances;
  const netSalary = payroll?.netSalary || (totalEarnings - deductions);
  
  const basicPct = totalEarnings > 0 ? Math.round((basic / totalEarnings) * 100) : 70;
  const allowPct = totalEarnings > 0 ? Math.round((allowances / totalEarnings) * 100) : 30;

  return (
    <Card className="overflow-hidden">
      {/* Header Banner */}
      <div className="bg-zinc-50 border-b border-zinc-100 px-6 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-900 text-[10px] font-mono mb-1 border border-zinc-200">
            <ShieldCheck className="w-3 h-3 text-black" />
            OFFICIALLY VERIFIED PLAN
          </div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight font-sans">Monthly Compensation Structure</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 font-mono shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Effective: {formatDate(payroll.effectiveDate || new Date().toISOString())}</span>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Earnings Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-black" />
                Monthly Earnings
              </h4>
              <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                Gross Inflow
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Basic Pay Scale</span>
                <span className="font-bold text-zinc-900">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">House Rent & Allowances</span>
                <span className="font-bold text-zinc-900">{formatCurrency(allowances)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 text-xs font-bold text-zinc-900">
                <span>Total Gross Earnings</span>
                <span className="text-zinc-900 font-mono">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            
            {/* Visual Bar Breakdown */}
            <div className="pt-2">
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200">
                <div style={{ width: `${basicPct}%` }} className="bg-black h-full" title={`Basic (${basicPct}%)`} />
                <div style={{ width: `${allowPct}%` }} className="bg-zinc-400 h-full" title={`Allowances (${allowPct}%)`} />
              </div>
              <div className="flex gap-4 mt-2 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-black" /> Basic ({basicPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-400" /> Allowances ({allowPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-zinc-500" />
                Statutory Deductions
              </h4>
              <span className="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                Standard
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Provident Fund (PF) & TDS</span>
                <span className="font-bold text-zinc-700">-{formatCurrency(deductions)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 text-xs font-bold text-zinc-800">
                <span>Total Deductions</span>
                <span className="font-mono text-zinc-800">-{formatCurrency(deductions)}</span>
              </div>
            </div>

            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 text-[11px] text-zinc-500 font-mono leading-relaxed">
              Standard statutory contributions including Provident Fund and applicable withholding taxes are calculated per fiscal rules.
            </div>
          </div>
        </div>

        {/* Take-Home Net Salary Highlight Box */}
        <div className="mt-8 bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Monthly In-Hand</span>
            <h4 className="text-base font-bold text-white mt-0.5 font-sans">Net Disbursed Compensation</h4>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">Gross Earnings – Deductions</p>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(netSalary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
