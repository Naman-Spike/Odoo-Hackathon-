import React from 'react';
import { CalendarX, Download, Clock, User } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
        <CalendarX className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-900">No attendance logs found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">There are no records matching the selected period or filters.</p>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.workDate || (a as any).date).getTime();
    const dateB = new Date(b.workDate || (b as any).date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
          <tr>
            <th className="px-4 py-3.5">Work Date</th>
            {showEmployee && (
              <th className="px-4 py-3.5">Team Member</th>
            )}
            <th className="px-4 py-3.5">Clock In</th>
            <th className="px-4 py-3.5">Clock Out</th>
            <th className="px-4 py-3.5">Duration</th>
            <th className="px-4 py-3.5 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedRecords.map((record) => {
            const empName = record.user?.profile?.firstName 
              ? `${record.user.profile.firstName} ${record.user.profile.lastName}`
              : (record as any).employeeName || 'Staff';

            return (
              <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                  {formatDate(record.workDate || (record as any).date)}
                </td>
                
                {showEmployee && (
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                        {getInitials(empName, '')}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">{empName}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({record.user?.employeeId || (record as any).empId || 'EMP'})</span>
                      </div>
                    </div>
                  </td>
                )}

                <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                  {record.checkIn ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {formatTime(record.checkIn)}
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                  {record.checkOut ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {formatTime(record.checkOut)}
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                  {record.totalHours !== null && record.totalHours > 0 ? (
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {record.totalHours.toFixed(2)}h
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <Badge variant={
                    record.status === 'PRESENT' ? 'success' :
                    record.status === 'HALF_DAY' ? 'warning' :
                    record.status === 'LEAVE' ? 'info' : 'danger'
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
