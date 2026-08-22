import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Wallet, ArrowDownRight, ArrowUpRight, DollarSign, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface PayrollExpenditureChartProps {
  payrolls: any[];
}

export const PayrollExpenditureChart: React.FC<PayrollExpenditureChartProps> = ({ payrolls }) => {
  // Aggregate total gross, deductions, and net
  let totalBasic = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;
  let totalNet = 0;

  payrolls.forEach(p => {
    totalBasic += p.basicSalary || 0;
    totalAllowances += p.allowances || 0;
    totalDeductions += p.deductions || 0;
    totalNet += p.netSalary || (p.basicSalary + p.allowances - p.deductions) || 0;
  });

  const totalGross = totalBasic + totalAllowances;
  const netRatio = totalGross > 0 ? Math.round((totalNet / totalGross) * 100) : 85;
  const dedRatio = totalGross > 0 ? Math.round((totalDeductions / totalGross) * 100) : 15;

  return (
    <Card className="shadow-liquid overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black text-white shadow-sm">
              <Wallet className="w-3.5 h-3.5" />
            </span>
            <CardTitle className="text-sm font-bold text-zinc-900 font-sans tracking-tight">
              Payroll Expenditure & Outflow
            </CardTitle>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            Monthly Cycle
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
          Gross compensation allocation vs statutory withholding taxes
        </p>
      </CardHeader>

      <CardContent className="pt-2">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 font-mono">
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-between text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
              <span>Total Gross Inflow</span>
              <ArrowUpRight className="w-3 h-3 text-black" />
            </div>
            <div className="text-base font-black text-zinc-900 mt-1">
              {formatCurrency(totalGross)}
            </div>
            <div className="text-[9px] text-zinc-400 mt-0.5">Basic + Allowances</div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-between text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
              <span>Statutory Deductions</span>
              <ArrowDownRight className="w-3 h-3 text-zinc-500" />
            </div>
            <div className="text-base font-black text-zinc-700 mt-1">
              -{formatCurrency(totalDeductions)}
            </div>
            <div className="text-[9px] text-zinc-400 mt-0.5">PF + Withholding TDS</div>
          </div>

          <div className="p-3 bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-md">
            <div className="flex items-center justify-between text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
              <span>Net Disbursal</span>
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
            <div className="text-base font-black text-white mt-1">
              {formatCurrency(totalNet)}
            </div>
            <div className="text-[9px] text-zinc-400 mt-0.5">Net In-Hand ({netRatio}%)</div>
          </div>
        </div>

        {/* Proportional Split Bar */}
        <div className="space-y-2 font-mono">
          <div className="flex justify-between text-xs font-bold text-zinc-800">
            <span>Disbursal Composition</span>
            <span>{netRatio}% In-Hand / {dedRatio}% Withheld</span>
          </div>

          <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200 shadow-inner">
            <div
              style={{ width: `${netRatio}%` }}
              className="bg-black h-full transition-all duration-500"
              title={`Net Disbursed (${netRatio}%)`}
            />
            <div
              style={{ width: `${dedRatio}%` }}
              className="bg-zinc-400 h-full transition-all duration-500"
              title={`Statutory Deductions (${dedRatio}%)`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black" /> Net Disbursed Compensation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-400" /> Tax & PF Withholdings
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
