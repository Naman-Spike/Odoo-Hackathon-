import React from 'react';
import { classNames } from '../../lib/utils';

interface AttendanceRecord {
  id: string;
  userId: string;
  workDate: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  month: number;
  year: number;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records, month, year }) => {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
  
  // Adjust so Monday is 0, Sunday is 6
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days = [];
  const today = new Date();

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getRecordForDay = (day: number) => {
    const targetDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return records.find(r => {
      const raw = r.workDate || (r as any).date;
      if (!raw) return false;
      if (typeof raw === 'string' && raw.startsWith(targetDateStr)) return true;
      const d = new Date(raw);
      return !isNaN(d.getTime()) && d.getDate() === day && (d.getMonth() + 1) === month && d.getFullYear() === year;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT': 
        return { label: 'Present', bg: 'bg-zinc-100 text-zinc-900 border-zinc-300', dot: 'bg-black' };
      case 'ABSENT': 
        return { label: 'Absent', bg: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400' };
      case 'HALF_DAY': 
        return { label: 'Half Day', bg: 'bg-zinc-100 text-zinc-800 border-zinc-300', dot: 'bg-zinc-600' };
      case 'LEAVE': 
        return { label: 'Leave', bg: 'bg-zinc-100 text-zinc-800 border-zinc-300', dot: 'bg-zinc-500' };
      default: 
        return { label: status, bg: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400' };
    }
  };

  return (
    <div className="w-full">
      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-[11px] font-mono text-zinc-500 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-black shadow-sm" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-400" />
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-300" />
          <span>Absent</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 bg-zinc-50/80 p-2.5 rounded-2xl border border-zinc-200 shadow-inner">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
          <div key={dayName} className={classNames(
            "py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg",
            idx >= 5 ? "text-zinc-400 bg-white/40" : "text-zinc-500"
          )}>
            {dayName}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="bg-transparent min-h-[90px] rounded-xl" />;
          }

          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const currentLoopDate = new Date(`${dateStr}T00:00:00`);
          const isToday = currentLoopDate.toDateString() === today.toDateString();
          const isFuture = currentLoopDate > today;
          
          const dayOfWeek = index % 7;
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

          const record = getRecordForDay(day);
          
          let inferredStatus = record?.status;
          if (!record && !isFuture && !isWeekend) {
             inferredStatus = 'ABSENT';
          }

          const badge = inferredStatus ? getStatusBadge(inferredStatus) : null;

          return (
            <div 
              key={day} 
              className={classNames(
                "min-h-[95px] p-2 rounded-xl border transition-all duration-150 flex flex-col justify-between backdrop-blur-md",
                isWeekend ? "bg-zinc-100/40 border-zinc-200/50" : "bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white",
                isToday ? "ring-2 ring-black border-black bg-white shadow-md" : "",
                isFuture ? "opacity-40 bg-zinc-50" : ""
              )}
            >
              <div className="flex justify-between items-start">
                <span className={classNames(
                  "text-xs font-mono font-bold px-1.5 py-0.5 rounded-md",
                  isToday ? "bg-black text-white font-bold" : "text-zinc-800"
                )}>
                  {day}
                </span>
                {isToday && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-tight text-zinc-900">TODAY</span>
                )}
              </div>

              {badge && !isFuture && !isWeekend && (
                <div className="mt-2 space-y-1">
                  <div className={classNames("px-1.5 py-0.5 rounded border text-[9px] font-mono flex items-center gap-1", badge.bg)}>
                    <span className={classNames("w-1 h-1 rounded-full", badge.dot)} />
                    <span className="truncate">{badge.label}</span>
                  </div>
                  
                  {record?.totalHours != null && record.totalHours > 0 && (
                    <div className="text-[10px] font-mono text-zinc-500 text-right">
                      {record.totalHours.toFixed(1)}h
                    </div>
                  )}
                </div>
              )}

              {isWeekend && (
                <div className="text-[9px] font-mono text-zinc-400 text-center my-auto">
                  Weekend
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
