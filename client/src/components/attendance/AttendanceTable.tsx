import React from 'react';
import { CalendarX } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime, getInitials } from '../../lib/utils';

interface UserData {
  employeeId: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    department: string;
  };
}

interface AttendanceRecord {
  id: string;
  userId: string;
  workDate: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
  user?: UserData;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployee?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, showEmployee = false }) => {
  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
        <CalendarX className="w-10 h-10 text-zinc-400 mb-3" />
        <h3 className="text-sm font-bold text-zinc-800">No ledger logs found</h3>
        <p className="text-xs text-zinc-500 font-mono mt-1">No attendance records matching the current parameters.</p>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.workDate || (a as any).date).getTime();
    const dateB = new Date(b.workDate || (b as any).date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase">
          <tr>
            <th className="px-4 py-3.5">Session Date</th>
            {showEmployee && (
              <th className="px-4 py-3.5">Staff Identity</th>
            )}
            <th className="px-4 py-3.5">Clock In</th>
            <th className="px-4 py-3.5">Clock Out</th>
            <th className="px-4 py-3.5">Session Duration</th>
            <th className="px-4 py-3.5 text-right">Verification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {sortedRecords.map((record) => {
            const empName = record.user?.profile?.firstName 
              ? `${record.user.profile.firstName} ${record.user.profile.lastName}`
              : (record as any).employeeName || 'Staff';

            return (
              <tr key={record.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-4 py-3.5 font-mono font-bold text-zinc-900 whitespace-nowrap">
                  {formatDate(record.workDate || (record as any).date)}
                </td>
                
                {showEmployee && (
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-black text-white font-bold text-[9px] flex items-center justify-center">
                        {getInitials(empName, '')}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900">{empName}</span>
                        <span className="text-[10px] text-zinc-500 ml-1.5 font-mono">({record.user?.employeeId || (record as any).empId || 'EMP'})</span>
                      </div>
                    </div>
                  </td>
                )}

                <td className="px-4 py-3.5 text-zinc-700 font-mono whitespace-nowrap">
                  {record.checkIn ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-black" />
                      {formatTime(record.checkIn)}
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 text-zinc-500 font-mono whitespace-nowrap">
                  {record.checkOut ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-zinc-400" />
                      {formatTime(record.checkOut)}
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 font-mono font-semibold text-zinc-900 whitespace-nowrap">
                  {record.totalHours !== null && record.totalHours > 0 ? (
                    <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-[11px]">
                      {record.totalHours.toFixed(2)}h
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <Badge variant={
                    record.status === 'PRESENT' ? 'primary' :
                    record.status === 'HALF_DAY' ? 'warning' :
                    record.status === 'LEAVE' ? 'glass' : 'danger'
                  }>
                    {record.status?.replace('_', ' ') || 'PRESENT'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
