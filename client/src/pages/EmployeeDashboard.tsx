import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Clock, 
  CalendarDays, 
  Wallet, 
  LogIn, 
  LogOut, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/utils';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendanceToday, setAttendanceToday] = useState<any>(null);
  const [leaveBalance, setLeaveBalance] = useState<{ paid: number; sick: number; unpaid: number }>({ paid: 0, sick: 0, unpaid: 0 });
  const [monthlyHours, setMonthlyHours] = useState<number>(0);
  const [presentDays, setPresentDays] = useState<number>(0);
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const firstName = user?.profile?.firstName || 'Employee';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (attendanceToday?.checkIn && !attendanceToday?.checkOut) {
      const interval = setInterval(() => {
        const checkInTime = new Date(attendanceToday.checkIn).getTime();
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - checkInTime) / 1000)));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [attendanceToday]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayRes, balanceRes, myAttRes, leavesRes] = await Promise.all([
        api.get('/attendance/today').catch(() => ({ data: null })),
        api.get('/leaves/balance').catch(() => ({ data: { paid: { remaining: 12 }, sick: { remaining: 6 }, unpaid: { used: 0 } } })),
        api.get('/attendance/my').catch(() => ({ data: [] })),
        api.get('/leaves/my').catch(() => ({ data: [] }))
      ]);

      setAttendanceToday(todayRes.data);
      
      const balData = balanceRes.data;
      setLeaveBalance({
        paid: balData?.paid?.remaining ?? (typeof balData?.paid === 'number' ? balData.paid : 12),
        sick: balData?.sick?.remaining ?? 6,
        unpaid: balData?.unpaid?.used ?? 0
      });

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      let totalHours = 0;
      let presentCount = 0;
      
      const attendanceData = Array.isArray(myAttRes.data) ? myAttRes.data : [];
      attendanceData.forEach((record: any) => {
        const recordDate = new Date(record.workDate || record.date);
        if (recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear) {
          if (record.totalHours) {
            totalHours += record.totalHours;
          }
          if (record.status === 'PRESENT' || record.status === 'HALF_DAY' || record.checkIn) {
            presentCount++;
          }
        }
      });
      
      setMonthlyHours(totalHours);
      setPresentDays(presentCount);

      const leaves = Array.isArray(leavesRes.data) ? leavesRes.data : [];
      setRecentLeaves(leaves.slice(0, 5));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setIsActionLoading(true);
      const res = await api.post('/attendance/check-in');
      setAttendanceToday(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to check in');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsActionLoading(true);
      const res = await api.post('/attendance/check-out');
      setAttendanceToday(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to check out');
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Progress of 8 hour workday
  const currentWorkSeconds = attendanceToday?.checkOut 
    ? (attendanceToday.totalHours || 0) * 3600 
    : elapsedSeconds;
  const progressPercent = Math.min(100, Math.round((currentWorkSeconds / (8 * 3600)) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-semibold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 translate-y-12 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-medium mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Employee Portal</span>
              <span>•</span>
              <span>{user?.profile?.department || 'General Department'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p className="text-indigo-100/80 text-sm mt-1 max-w-lg">
              {attendanceToday?.checkIn && !attendanceToday?.checkOut
                ? 'Your shift is currently active. Keep up the productive momentum!'
                : attendanceToday?.checkOut
                ? 'Great work today! Your shift hours have been recorded in the system.'
                : 'Ready to kick off today? Click check-in to begin logging your hours.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">Date</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">Status</div>
              <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  attendanceToday?.checkIn && !attendanceToday?.checkOut 
                    ? 'bg-emerald-400 animate-pulse' 
                    : attendanceToday?.checkOut 
                    ? 'bg-sky-400' 
                    : 'bg-amber-400'
                }`} />
                {attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'Active' : attendanceToday?.checkOut ? 'Completed' : 'Off-Duty'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row: Live Timecard Widget + 3 Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Attendance / Timecard Card */}
        <div className="lg:col-span-5">
          <Card className="h-full border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Today's Timecard
                </CardTitle>
                <Badge variant={attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'success' : attendanceToday?.checkOut ? 'info' : 'default'}>
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'In Progress' : attendanceToday?.checkOut ? 'Recorded' : 'Not Started'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center">
              {/* Digital Timer Display */}
              <div className="mb-4">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 tracking-tight">
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut
                    ? formatElapsed(elapsedSeconds)
                    : attendanceToday?.checkOut
                    ? `${(attendanceToday.totalHours || 0).toFixed(2)} hrs`
                    : '00:00:00'}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut
                    ? `Checked in at ${new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : attendanceToday?.checkOut
                    ? `Shift completed (${new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(attendanceToday.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                    : 'Standard target: 8.0 hours / day'}
                </p>
              </div>

              {/* Workday Progress Bar */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Shift Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full">
                {!attendanceToday?.checkIn ? (
                  <Button 
                    onClick={handleCheckIn} 
                    variant="success" 
                    className="w-full h-12 text-sm shadow-glow-success"
                    isLoading={isActionLoading}
                    icon={LogIn}
                  >
                    Check In for Work
                  </Button>
                ) : attendanceToday?.checkIn && !attendanceToday?.checkOut ? (
                  <Button 
                    onClick={handleCheckOut} 
                    variant="danger" 
                    className="w-full h-12 text-sm shadow-glow-danger"
                    isLoading={isActionLoading}
                    icon={LogOut}
                  >
                    Complete & Check Out
                  </Button>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-medium text-emerald-800 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You have finished your work session for today.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3 Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Paid Leave */}
          <Card hoverEffect className="bg-gradient-to-br from-white to-blue-50/40 border-blue-100 flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Paid Leave</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{leaveBalance.paid}</div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between text-xs text-slate-500">
              <span>Annual Quota</span>
              <span className="font-semibold text-slate-700">12 Days</span>
            </div>
          </Card>

          {/* Card 2: Hours This Month */}
          <Card hoverEffect className="bg-gradient-to-br from-white to-indigo-50/40 border-indigo-100 flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Hours Logged</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{monthlyHours.toFixed(1)}h</div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-50 flex items-center justify-between text-xs text-slate-500">
              <span>This Month</span>
              <span className="font-semibold text-emerald-600">On Track</span>
            </div>
          </Card>

          {/* Card 3: Days Present */}
          <Card hoverEffect className="bg-gradient-to-br from-white to-emerald-50/40 border-emerald-100 flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Days Present</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{presentDays}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs text-slate-500">
              <span>Attendance Rate</span>
              <span className="font-semibold text-slate-700">100%</span>
            </div>
          </Card>

          {/* Quick Action Navigation Buttons */}
          <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'My Profile', to: '/profile', icon: User, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100' },
              { label: 'Timecard', to: '/attendance', icon: Clock, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100' },
              { label: 'Apply Leave', to: '/leave', icon: CalendarDays, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100' },
              { label: 'Payslip', to: '/payroll', icon: Wallet, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.to)}
                className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${item.color}`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leave Requests List */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            Recent Leave Applications
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentLeaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No leave requests filed yet. You can apply for leaves anytime from the Leave Tracker tab.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeaves.map((leave, idx) => (
                <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">{leave.leaveType} LEAVE</span>
                      <Badge variant={
                        leave.status === 'APPROVED' ? 'success' :
                        leave.status === 'REJECTED' ? 'danger' : 'warning'
                      }>
                        {leave.status || 'PENDING'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 max-w-md truncate">
                    "{leave.reason}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
