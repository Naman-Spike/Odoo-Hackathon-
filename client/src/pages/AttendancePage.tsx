import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Table as TableIcon, 
  Search, 
  Clock, 
  CheckCircle2, 
  UserX, 
  Plane,
  Download,
  Filter
} from 'lucide-react';
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
        setRecords(data || []);
      } else {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();
        
        const mStart = `${year}-${month.toString().padStart(2, '0')}-01`;
        const mEnd = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
        
        const { data } = await api.get(`/attendance/my?startDate=${mStart}&endDate=${mEnd}`);
        setRecords(data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records');
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

  // CSV Export Functionality
  const exportToCSV = () => {
    if (!records || records.length === 0) return;
    
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Check In', 'Check Out', 'Total Hours', 'Status'];
    const rows = records.map(r => [
      r.workDate || r.date,
      r.user?.employeeId || '',
      r.user?.profile ? `${r.user.profile.firstName} ${r.user.profile.lastName}` : '',
      r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '',
      r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '',
      r.totalHours || '0',
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dayflow_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const todayRecords = records.filter(r => (r.workDate || r.date)?.startsWith(todayStr));
    
    const presentToday = todayRecords.filter(r => ['PRESENT', 'HALF_DAY'].includes(r.status) || r.checkIn).length;
    const absentToday = todayRecords.filter(r => r.status === 'ABSENT').length;
    const leaveToday = todayRecords.filter(r => r.status === 'LEAVE').length;

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Organization Attendance</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track, audit, and export staff timecard logs across all branches</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs text-slate-700 bg-transparent border-0 focus:ring-0 p-0"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs text-slate-700 bg-transparent border-0 focus:ring-0 p-0"
              />
            </div>
            
            <Button variant="outline" size="sm" icon={Download} onClick={exportToCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card hoverEffect className="p-5 bg-gradient-to-br from-white to-emerald-50/40 border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-700">Present Today</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{presentToday}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Logged & Active</span>
            </div>
            <div className="p-3.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </Card>

          <Card hoverEffect className="p-5 bg-gradient-to-br from-white to-rose-50/40 border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-rose-700">Absent Today</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{absentToday}</div>
              <span className="text-[10px] text-rose-600 font-medium">No check-in record</span>
            </div>
            <div className="p-3.5 bg-rose-100 text-rose-700 rounded-2xl">
              <UserX className="w-6 h-6" />
            </div>
          </Card>

          <Card hoverEffect className="p-5 bg-gradient-to-br from-white to-sky-50/40 border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-sky-700">On Approved Leave</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{leaveToday}</div>
              <span className="text-[10px] text-sky-600 font-medium">Synced from leaves</span>
            </div>
            <div className="p-3.5 bg-sky-100 text-sky-700 rounded-2xl">
              <Plane className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Filtered Attendance Table */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Detailed Attendance Ledger
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Filter by staff name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 w-full text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-rose-500 p-4 text-center text-xs font-semibold">{error}</div>
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
  
  const presentDays = records.filter(r => r.status === 'PRESENT' || r.checkIn).length;
  const halfDays = records.filter(r => r.status === 'HALF_DAY').length;
  const absentDays = records.filter(r => r.status === 'ABSENT').length;
  const totalHours = records.reduce((acc, r) => acc + (r.totalHours || 0), 0);
  const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance & Timecard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your daily shifts, view monthly history, and audit worked hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <CheckInOutWidget />
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full border-slate-200 flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  Monthly Summary — {monthName}
                </h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Target: 160h / mo
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Present</div>
                  <div className="text-2xl font-extrabold text-emerald-900 mt-1">{presentDays}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Days logged</div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Half Days</div>
                  <div className="text-2xl font-extrabold text-amber-900 mt-1">{halfDays}</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">&lt; 4.0 hours</div>
                </div>

                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Total Hours</div>
                  <div className="text-2xl font-extrabold text-indigo-900 mt-1">{totalHours.toFixed(1)}h</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">Cumulative</div>
                </div>

                <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Daily Avg</div>
                  <div className="text-2xl font-extrabold text-purple-900 mt-1">{avgHours}h</div>
                  <div className="text-[10px] text-purple-600 mt-0.5">Per present day</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Standard Work Schedule: Monday to Friday (9:00 AM – 5:30 PM)</span>
              <span className="font-semibold text-slate-700">8.5h / day</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Calendar / Table Container */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table Logs
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-bold text-xs sm:text-sm text-slate-800 min-w-[140px] text-center font-mono">
              {monthName}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
             </div>
          ) : error ? (
             <div className="text-rose-500 p-8 text-center text-xs font-semibold">{error}</div>
          ) : (
            <div>
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
