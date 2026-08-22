import React from 'react';
import { CalendarX } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime, getStatusColor } from '../../lib/utils';

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
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-lg">
        <CalendarX className="w-12 h-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No attendance records found</h3>
        <p className="text-sm text-gray-500">There is no data available for the selected period.</p>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime());

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <Table className="min-w-full divide-y divide-gray-200 bg-white">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
            {showEmployee && (
              <>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</TableHead>
              </>
            )}
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {sortedRecords.map((record) => (\r\n            <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {formatDate(record.workDate)}
              </TableCell>
              {showEmployee && (
                <>
                  <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                    {record.user?.profile?.firstName} {record.user?.profile?.lastName}
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    {record.user?.employeeId}
                  </TableCell>
                </>
              )}
              <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                {record.checkIn ? formatTime(record.checkIn) : '-'}
              </TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                {record.checkOut ? formatTime(record.checkOut) : '-'}
              </TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                {record.totalHours !== null ? record.totalHours.toFixed(1) : '-'}
              </TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                  {record.status.replace('_', ' ')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
