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
      <div className="bg-white/[0.04] border-b border-white/10 px-6 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono mb-1 border border-white/15">
            <ShieldCheck className="w-3 h-3 text-white" />
            OFFICIALLY VERIFIED PLAN
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight font-sans">Monthly Compensation Structure</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>Effective: {formatDate(payroll.effectiveDate || new Date().toISOString())}</span>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Earnings Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-white" />
                Monthly Earnings
              </h4>
              <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                Gross Inflow
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Basic Pay Scale</span>
                <span className="font-bold text-white">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">House Rent & Allowances</span>
                <span className="font-bold text-white">{formatCurrency(allowances)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-bold text-white">
                <span>Total Gross Earnings</span>
                <span className="text-white font-mono">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            
            {/* Visual Bar Breakdown */}
            <div className="pt-2">
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden flex border border-white/10">
                <div style={{ width: `${basicPct}%` }} className="bg-white h-full" title={`Basic (${basicPct}%)`} />
                <div style={{ width: `${allowPct}%` }} className="bg-zinc-500 h-full" title={`Allowances (${allowPct}%)`} />
              </div>
              <div className="flex gap-4 mt-2 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white" /> Basic ({basicPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-500" /> Allowances ({allowPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-zinc-400" />
                Statutory Deductions
              </h4>
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
                Standard
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Provident Fund (PF) & TDS</span>
                <span className="font-bold text-zinc-300">-{formatCurrency(deductions)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-bold text-zinc-300">
                <span>Total Deductions</span>
                <span className="font-mono text-zinc-300">-{formatCurrency(deductions)}</span>
              </div>
            </div>

            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/[0.08] text-[11px] text-zinc-500 font-mono leading-relaxed">
              Standard statutory contributions including Provident Fund and applicable withholding taxes are calculated per fiscal rules.
            </div>
          </div>
        </div>

        {/* Take-Home Net Salary Highlight Box */}
        <div className="mt-8 bg-black/60 rounded-2xl p-6 sm:p-8 border border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-specular">
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Monthly In-Hand</span>
            <h4 className="text-base font-bold text-white mt-0.5 font-sans">Net Disbursed Compensation</h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">Gross Earnings – Deductions</p>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(netSalary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
