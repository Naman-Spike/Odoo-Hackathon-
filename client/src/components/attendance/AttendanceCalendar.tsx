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
    return records.find(r => r.workDate === dateStr);
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-500';
      case 'ABSENT': return 'bg-red-500';
      case 'HALF_DAY': return 'bg-yellow-500';
      case 'LEAVE': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (\r\n          <div key={dayName} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {dayName}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="bg-white min-h-[100px]" />;
          }

          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const currentLoopDate = new Date(`${dateStr}T00:00:00`);
          const isToday = currentLoopDate.toDateString() === today.toDateString();
          const isFuture = currentLoopDate > today;
          
          // Saturday is index 5, Sunday is index 6
          const dayOfWeek = index % 7;
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

          const record = getRecordForDay(day);
          
          let inferredStatus = record?.status;
          if (!record && !isFuture && !isWeekend) {
             inferredStatus = 'ABSENT';
          }

          return (
            <div 
              key={day} 
              className={classNames(
                "min-h-[100px] p-2 bg-white relative transition-colors",
                isWeekend ? "bg-gray-50" : "",
                isToday ? "ring-2 ring-inset ring-indigo-500" : "",
                isFuture ? "opacity-50" : ""
              )}
            >
              <span className={classNames(
                "text-sm font-medium",
                isToday ? "text-indigo-600 font-bold" : "text-gray-700"
              )}>
                {day}
              </span>

              {inferredStatus && !isFuture && (
                <div className="mt-2 flex flex-col items-center space-y-1">
                  <div className={classNames(
                    "w-3 h-3 rounded-full",
                    getStatusColorClass(inferredStatus)
                  )} title={inferredStatus} />
                  
                  {record?.totalHours != null && (
                    <span className="text-[10px] text-gray-500">
                      {record.totalHours.toFixed(1)}h
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
