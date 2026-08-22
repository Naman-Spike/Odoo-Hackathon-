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
  Download
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CheckInOutWidget } from '../components/attendance/CheckInOutWidget';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

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
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Attendance Telemetry</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Audit personnel timecard logs across all divisions</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200 shadow-inner font-mono text-xs text-zinc-800 backdrop-blur-md">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs text-zinc-800 bg-transparent border-0 focus:ring-0 p-0"
              />
              <span className="text-zinc-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs text-zinc-800 bg-transparent border-0 focus:ring-0 p-0"
              />
            </div>
            
            <Button variant="outline" size="sm" icon={Download} onClick={exportToCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card hoverEffect className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Present Today</span>
              <div className="text-3xl font-extrabold text-zinc-900 mt-1 font-mono">{presentToday}</div>
              <span className="text-[10px] text-zinc-500 font-mono">Verified Active</span>
            </div>
            <div className="p-3 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Absent Today</span>
              <div className="text-3xl font-extrabold text-zinc-900 mt-1 font-mono">{absentToday}</div>
              <span className="text-[10px] text-zinc-500 font-mono">No Check-in Logged</span>
            </div>
            <div className="p-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl">
              <UserX className="w-5 h-5" />
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Approved Leave</span>
              <div className="text-3xl font-extrabold text-zinc-900 mt-1 font-mono">{leaveToday}</div>
              <span className="text-[10px] text-zinc-500 font-mono">Synced from Quotas</span>
            </div>
            <div className="p-3 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
              <Plane className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Filtered Attendance Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              Detailed Attendance Ledger
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                placeholder="Filter by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-9 pr-4 w-full text-xs rounded-xl border border-zinc-200 bg-white/90 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors backdrop-blur-md font-mono"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-black" />
              </div>
            ) : error ? (
              <div className="text-rose-600 p-4 text-center text-xs font-mono">{error}</div>
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
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Attendance Telemetry</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage daily shifts, audit monthly ledger, and view active hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <CheckInOutWidget />
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
                  Monthly Summary — {monthName}
                </h3>
                <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">
                  Target: 160h / mo
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Present</div>
                  <div className="text-2xl font-extrabold text-zinc-900 mt-1 font-mono">{presentDays}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Days Logged</div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Half Days</div>
                  <div className="text-2xl font-extrabold text-zinc-900 mt-1 font-mono">{halfDays}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">&lt; 4.0 Hours</div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Total Hours</div>
                  <div className="text-2xl font-extrabold text-zinc-900 mt-1 font-mono">{totalHours.toFixed(1)}h</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Cumulative</div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Daily Avg</div>
                  <div className="text-2xl font-extrabold text-zinc-900 mt-1 font-mono">{avgHours}h</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Per Present Day</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Standard Shift: Monday to Friday (09:00 – 17:30)</span>
              <span className="text-zinc-900 font-semibold">8.5h / day</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Calendar / Table Container */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar' 
                  ? 'bg-white text-zinc-900 shadow-sm font-bold' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar Matrix
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-zinc-900 shadow-sm font-bold' 
                  : 'text-zinc-500 hover:text-zinc-900'
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
            <span className="font-bold text-xs sm:text-sm text-zinc-900 min-w-[140px] text-center font-mono">
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
               <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-black" />
             </div>
          ) : error ? (
             <div className="text-rose-600 p-8 text-center text-xs font-mono">{error}</div>
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
