import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar, TrendingUp, ShieldCheck, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

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
    <Card className="overflow-hidden shadow-sm border-slate-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-1 border border-indigo-500/30">
            <ShieldCheck className="w-3 h-3" />
            Verified Salary Plan
          </div>
          <h3 className="text-xl font-bold tracking-tight">Compensation & Benefits Breakdown</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>Effective: {formatDate(payroll.effectiveDate || new Date().toISOString())}</span>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Earnings Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                Monthly Earnings
              </h4>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Gross Additions
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Basic Pay Scale</span>
                <span className="font-bold text-slate-900 font-mono">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Allowances (HRA, Travel, Special)</span>
                <span className="font-bold text-slate-900 font-mono">{formatCurrency(allowances)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-bold text-slate-900">
                <span>Total Gross Earnings</span>
                <span className="font-mono text-emerald-700">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            
            {/* Visual Bar Breakdown */}
            <div className="pt-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${basicPct}%` }} className="bg-indigo-600 h-full" title={`Basic (${basicPct}%)`} />
                <div style={{ width: `${allowPct}%` }} className="bg-purple-500 h-full" title={`Allowances (${allowPct}%)`} />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" /> Basic ({basicPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500" /> Allowances ({allowPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
                Deductions & Taxes
              </h4>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Standard
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Income Tax (TDS) / PF / Deductions</span>
                <span className="font-bold text-rose-600 font-mono">-{formatCurrency(deductions)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-bold text-slate-900">
                <span>Total Deductions</span>
                <span className="font-mono text-rose-600">-{formatCurrency(deductions)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-[11px] text-slate-500 mt-4 leading-relaxed">
              Standard statutory contributions including Provident Fund (PF) and applicable income taxes are deducted monthly.
            </div>
          </div>
        </div>

        {/* Take-Home Net Salary Highlight Box */}
        <div className="mt-8 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-indigo-500/10 rounded-2xl p-6 sm:p-8 border border-emerald-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Take-Home Monthly Compensation</span>
            <h4 className="text-base font-extrabold text-slate-900 mt-0.5">Net Disbursed Pay (In-Hand)</h4>
            <p className="text-xs text-slate-500 mt-1 font-mono">Formula: Gross Earnings - Total Deductions</p>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono tracking-tight">
            {formatCurrency(netSalary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
