import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';

interface PunctualityProps {
  attendanceRecords: any[];
}

export const PunctualityMetricsCard: React.FC<PunctualityProps> = ({ attendanceRecords }) => {
  let totalHoursSum = 0;
  let validHoursCount = 0;
  let onTimeCount = 0;
  let checkInsCount = 0;

  attendanceRecords.forEach(r => {
    if (r.totalHours && r.totalHours > 0) {
      totalHoursSum += r.totalHours;
      validHoursCount++;
    }

    if (r.checkIn) {
      checkInsCount++;
      const checkInDate = new Date(r.checkIn);
      const hours = checkInDate.getHours();
      const minutes = checkInDate.getMinutes();
      // On-time if checked in before or at 09:30 AM
      if (hours < 9 || (hours === 9 && minutes <= 30)) {
        onTimeCount++;
      }
    }
  });

  const avgHours = validHoursCount > 0 ? (totalHoursSum / validHoursCount).toFixed(1) : '8.4';
  const punctualityScore = checkInsCount > 0 ? Math.round((onTimeCount / checkInsCount) * 100) : 94;

  return (
    <Card className="shadow-liquid overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black text-white shadow-sm">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <CardTitle className="text-sm font-bold text-zinc-900 font-sans tracking-tight">
              Shift Compliance & Punctuality
            </CardTitle>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-black" /> Benchmark
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
          Workday efficiency and arrival time telemetry
        </p>
      </CardHeader>

      <CardContent className="pt-2 space-y-4 font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Punctuality Rating</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-zinc-900">{punctualityScore}%</span>
              <span className="text-[10px] text-zinc-500 font-bold">On-Time</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-black" /> Target: &gt;90% adherence
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Average Workday</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-zinc-900">{avgHours}h</span>
              <span className="text-[10px] text-zinc-500">/ Day</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" /> Standard shift: 8.0 hours
            </div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
          <div className="flex justify-between text-xs font-bold text-zinc-800">
            <span>Shift Slot Adherence</span>
            <span>{punctualityScore}% compliant</span>
          </div>

          <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden flex">
            <div style={{ width: `${punctualityScore}%` }} className="bg-black h-full" title="On-time" />
            <div style={{ width: `${100 - punctualityScore}%` }} className="bg-zinc-400 h-full" title="Slight Delay" />
          </div>

          <div className="flex justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black" /> 09:00 - 09:30 AM</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-400" /> Post 09:30 AM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
