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
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return records.find(r => (r.workDate || (r as any).date)?.startsWith(dateStr));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT': 
        return { label: 'Present', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'ABSENT': 
        return { label: 'Absent', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'HALF_DAY': 
        return { label: 'Half Day', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'LEAVE': 
        return { label: 'On Leave', bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' };
      default: 
        return { label: status, bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  return (
    <div className="w-full">
      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-semibold text-slate-600 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Absent</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 bg-slate-100/70 p-2 rounded-2xl border border-slate-200">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
          <div key={dayName} className={classNames(
            "py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg",
            idx >= 5 ? "text-slate-400 bg-slate-200/40" : "text-slate-600"
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
                "min-h-[95px] p-2 bg-white rounded-xl border transition-all duration-150 flex flex-col justify-between",
                isWeekend ? "bg-slate-50/70 border-slate-100" : "border-slate-200/80 shadow-2xs hover:shadow-sm",
                isToday ? "ring-2 ring-indigo-600 border-transparent shadow-glow" : "",
                isFuture ? "opacity-40 bg-slate-50/50" : ""
              )}
            >
              <div className="flex justify-between items-start">
                <span className={classNames(
                  "text-xs font-bold px-1.5 py-0.5 rounded-md",
                  isToday ? "bg-indigo-600 text-white shadow-xs" : "text-slate-700"
                )}>
                  {day}
                </span>
                {isToday && (
                  <span className="text-[9px] font-extrabold uppercase tracking-tight text-indigo-600">Today</span>
                )}
              </div>

              {badge && !isFuture && !isWeekend && (
                <div className="mt-2 space-y-1">
                  <div className={classNames("px-2 py-0.5 rounded-md border text-[10px] font-semibold flex items-center gap-1", badge.bg)}>
                    <span className={classNames("w-1.5 h-1.5 rounded-full", badge.dot)} />
                    <span className="truncate">{badge.label}</span>
                  </div>
                  
                  {record?.totalHours != null && record.totalHours > 0 && (
                    <div className="text-[10px] font-mono text-slate-500 font-medium text-right">
                      {record.totalHours.toFixed(1)} hrs
                    </div>
                  )}
                </div>
              )}

              {isWeekend && (
                <div className="text-[10px] text-slate-400 font-medium text-center my-auto">
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
