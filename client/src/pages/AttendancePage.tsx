import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Table as TableIcon, Search } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CheckInOutWidget } from '../components/attendance/CheckInOutWidget';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export const AttendancePage: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // Common states
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Employee specific states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');

  // Admin specific states
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        const { data } = await api.get(`/attendance/all?startDate=${startDate}&endDate=${endDate}`);
        setRecords(data);
      } else {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();
        
        const mStart = `${year}-${month.toString().padStart(2, '0')}-01`;
        const mEnd = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
        
        const { data } = await api.get(`/attendance/my?startDate=${mStart}&endDate=${mEnd}`);
        setRecords(data);
      }
    } catch (err: any) {\r\n      setError(err.response?.data?.message || 'Failed to fetch attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [isAdmin, currentDate, startDate, endDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (isAdmin) {
    const filteredRecords = records.filter(r => {
      if (!searchTerm) return true;
      const name = `${r.user?.profile?.firstName || ''} ${r.user?.profile?.lastName || ''}`.toLowerCase();
      const empId = r.user?.employeeId?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return name.includes(search) || empId.includes(search);
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.workDate === todayStr);
    
    const presentToday = todayRecords.filter(r => ['PRESENT', 'HALF_DAY'].includes(r.status)).length;
    const absentToday = todayRecords.filter(r => r.status === 'ABSENT').length;
    const leaveToday = todayRecords.filter(r => r.status === 'LEAVE').length;

    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Attendance Overview</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500">Present Today</div>
              <div className="mt-2 text-3xl font-bold text-green-600">{presentToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500">Absent Today</div>
              <div className="mt-2 text-3xl font-bold text-red-600">{absentToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500">On Leave Today</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{leaveToday}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle>Attendance Records</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (\r\n              <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : (
              <AttendanceTable records={filteredRecords} showEmployee={true} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employee View
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const presentDays = records.filter(r => r.status === 'PRESENT').length;
  const halfDays = records.filter(r => r.status === 'HALF_DAY').length;
  const absentDays = records.filter(r => r.status === 'ABSENT').length;
  const totalHours = records.reduce((acc, r) => acc + (r.totalHours || 0), 0);
  const avgHours = records.length > 0 ? (totalHours / records.length).toFixed(1) : '0';

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CheckInOutWidget />
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Summary ({monthName})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-sm text-green-800">Present</div>
                  <div className="text-2xl font-bold text-green-900">{presentDays}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="text-sm text-red-800">Absent</div>
                  <div className="text-2xl font-bold text-red-900">{absentDays}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <div className="text-sm text-yellow-800">Half Days</div>
                  <div className="text-2xl font-bold text-yellow-900">{halfDays}</div>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="text-sm text-indigo-800">Total Hours</div>
                  <div className="text-2xl font-bold text-indigo-900">{totalHours.toFixed(1)}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 flex justify-end">
                Average hours per day: <span className="font-semibold text-gray-700 ml-1">{avgHours}h</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CalendarIcon className="w-4 h-4 mr-2 inline-block" />
                Calendar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <TableIcon className="w-4 h-4 mr-2 inline-block" />
                Table
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-gray-900 min-w-[140px] text-center">
              {monthName}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          ) : error ? (
             <div className="text-red-500 p-8 text-center">{error}</div>
          ) : (
            <div className="p-4 sm:p-6">
              {viewMode === 'calendar' ? (
                <AttendanceCalendar records={records} month={currentDate.getMonth() + 1} year={currentDate.getFullYear()} />
              ) : (
                <AttendanceTable records={records} showEmployee={false} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
