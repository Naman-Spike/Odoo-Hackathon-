import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface LeaveUtilizationProps {
  leaves: any[];
}

export const LeaveUtilizationGauge: React.FC<LeaveUtilizationProps> = ({ leaves }) => {
  const approved = leaves.filter(l => l.status === 'APPROVED').length;
  const pending = leaves.filter(l => l.status === 'PENDING' || !l.status).length;
  const rejected = leaves.filter(l => l.status === 'REJECTED').length;
  const totalRequests = leaves.length || 1;

  const approvedPct = Math.round((approved / totalRequests) * 100);
  const pendingPct = Math.round((pending / totalRequests) * 100);
  const rejectedPct = Math.round((rejected / totalRequests) * 100);

  // Type Breakdown
  const paidCount = leaves.filter(l => l.leaveType === 'PAID').length;
  const sickCount = leaves.filter(l => l.leaveType === 'SICK').length;
  const unpaidCount = leaves.filter(l => l.leaveType === 'UNPAID').length;

  return (
    <Card className="shadow-liquid overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black text-white shadow-sm">
              <CalendarDays className="w-3.5 h-3.5" />
            </span>
            <CardTitle className="text-sm font-bold text-zinc-900 font-sans tracking-tight">
              Leave Quota Velocity & Approvals
            </CardTitle>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            {leaves.length} Total Requests
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
          Resolution throughput and leave category distribution
        </p>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {/* Status Distribution Pills */}
        <div className="grid grid-cols-3 gap-2 font-mono text-center">
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-600 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-black" /> Approved
            </div>
            <div className="text-xl font-black text-zinc-900">{approved}</div>
            <div className="text-[9px] text-zinc-500">{approvedPct}%</div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-600 mb-0.5">
              <Clock className="w-3 h-3 text-zinc-500" /> Pending
            </div>
            <div className="text-xl font-black text-zinc-900">{pending}</div>
            <div className="text-[9px] text-zinc-500">{pendingPct}%</div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-600 mb-0.5">
              <XCircle className="w-3 h-3 text-zinc-400" /> Rejected
            </div>
            <div className="text-xl font-black text-zinc-700">{rejected}</div>
            <div className="text-[9px] text-zinc-500">{rejectedPct}%</div>
          </div>
        </div>

        {/* Category Breakdown Progress Bars */}
        <div className="space-y-3 pt-2 font-mono text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-zinc-600">Paid Annual Leaves</span>
              <span className="font-bold text-zinc-900">{paidCount} applications</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div
                style={{ width: `${Math.min(100, Math.round((paidCount / Math.max(1, leaves.length)) * 100))}%` }}
                className="bg-black h-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-zinc-600">Medical & Sick Leaves</span>
              <span className="font-bold text-zinc-900">{sickCount} applications</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div
                style={{ width: `${Math.min(100, Math.round((sickCount / Math.max(1, leaves.length)) * 100))}%` }}
                className="bg-zinc-600 h-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-zinc-600">Unpaid Leaves</span>
              <span className="font-bold text-zinc-900">{unpaidCount} applications</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div
                style={{ width: `${Math.min(100, Math.round((unpaidCount / Math.max(1, leaves.length)) * 100))}%` }}
                className="bg-zinc-400 h-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
