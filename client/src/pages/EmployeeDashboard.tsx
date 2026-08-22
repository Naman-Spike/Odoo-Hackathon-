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
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Shield
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

  const firstName = user?.profile?.firstName || 'Staff';

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
      setError(err.response?.data?.error || 'Failed to load dashboard telemetry.');
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
      setError(err.response?.data?.error || 'Check-in failed');
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
      setError(err.response?.data?.error || 'Check-out failed');
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
          <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Syncing node data...</p>
        </div>
      </div>
    );
  }

  // Workday Progress
  const currentWorkSeconds = attendanceToday?.checkOut 
    ? (attendanceToday.totalHours || 0) * 3600 
    : elapsedSeconds;
  const progressPercent = Math.min(100, Math.round((currentWorkSeconds / (8 * 3600)) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between backdrop-blur-md">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Hero Welcome Banner (White Crystal Glass) */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 border border-zinc-200/90 p-6 sm:p-8 shadow-liquid backdrop-blur-2xl specular-highlight">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-mono mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span>STAFF PORTAL</span>
              <span>•</span>
              <span className="text-zinc-500">{user?.profile?.department || 'Engineering'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 font-sans">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-zinc-500 text-xs mt-1 max-w-lg font-medium">
              {attendanceToday?.checkIn && !attendanceToday?.checkOut
                ? 'Work session currently active and streaming logs.'
                : attendanceToday?.checkOut
                ? 'Workday completed. Daily timecard synced to payroll.'
                : 'Session idle. Initiate shift below to begin recording timecard.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-zinc-50/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-zinc-200/80 text-center shadow-sm">
              <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Calendar</div>
              <div className="text-xs font-bold text-zinc-900 mt-0.5 font-mono">
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className="bg-zinc-50/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-zinc-200/80 text-center shadow-sm">
              <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Shift State</div>
              <div className="text-xs font-bold text-zinc-900 mt-0.5 flex items-center justify-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  attendanceToday?.checkIn && !attendanceToday?.checkOut 
                    ? 'bg-black animate-ping' 
                    : attendanceToday?.checkOut 
                    ? 'bg-zinc-500' 
                    : 'bg-zinc-300'
                }`} />
                <span>{attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'Active' : attendanceToday?.checkOut ? 'Logged' : 'Off-Shift'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Stopwatch + 3 Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timecard Stopwatch */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-700">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  Today's Timecard
                </CardTitle>
                <Badge variant={attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'primary' : attendanceToday?.checkOut ? 'glass' : 'default'}>
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut ? 'Live Session' : attendanceToday?.checkOut ? 'Completed' : 'Standby'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center">
              {/* Digital Stopwatch Display */}
              <div className="mb-5 bg-zinc-50 w-full py-6 rounded-2xl border border-zinc-200/80 shadow-inner">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-900 tracking-tight">
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut
                    ? formatElapsed(elapsedSeconds)
                    : attendanceToday?.checkOut
                    ? `${(attendanceToday.totalHours || 0).toFixed(2)} hrs`
                    : '00:00:00'}
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-2">
                  {attendanceToday?.checkIn && !attendanceToday?.checkOut
                    ? `Logged at ${new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : attendanceToday?.checkOut
                    ? `Recorded: ${new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(attendanceToday.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Standard Day Target: 8.00 Hours'}
                </p>
              </div>

              {/* Workday Progress Bar */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                  <span>Shift Telemetry</span>
                  <span className="font-bold text-zinc-900">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full">
                {!attendanceToday?.checkIn ? (
                  <Button 
                    onClick={handleCheckIn} 
                    variant="primary" 
                    className="w-full h-11 text-xs"
                    isLoading={isActionLoading}
                    icon={LogIn}
                  >
                    Check In for Work
                  </Button>
                ) : attendanceToday?.checkIn && !attendanceToday?.checkOut ? (
                  <Button 
                    onClick={handleCheckOut} 
                    variant="outline" 
                    className="w-full h-11 text-xs font-bold"
                    isLoading={isActionLoading}
                    icon={LogOut}
                  >
                    Complete & Check Out
                  </Button>
                ) : (
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-700 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900" />
                    <span>Session verified and submitted</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3 Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Paid Leave */}
          <Card hoverEffect className="flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Paid Leave</span>
                <div className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{leaveBalance.paid}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Annual Quota</span>
              <span className="text-zinc-900 font-semibold">12 Days</span>
            </div>
          </Card>

          {/* Card 2: Hours This Month */}
          <Card hoverEffect className="flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Hours Logged</span>
                <div className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{monthlyHours.toFixed(1)}h</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>This Month</span>
              <span className="text-zinc-900 font-semibold">100% Target</span>
            </div>
          </Card>

          {/* Card 3: Days Present */}
          <Card hoverEffect className="flex flex-col justify-between p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Days Present</span>
                <div className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{presentDays}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Attendance</span>
              <span className="text-zinc-900 font-semibold">Synchronized</span>
            </div>
          </Card>

          {/* Quick Action Navigation Buttons */}
          <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Personnel Profile', to: '/profile', icon: User },
              { label: 'Timecard Ledger', to: '/attendance', icon: Clock },
              { label: 'Apply for Leave', to: '/leave', icon: CalendarDays },
              { label: 'Salary Payslip', to: '/payroll', icon: Wallet },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.to)}
                className="p-3.5 rounded-2xl border border-zinc-200/80 bg-white/80 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-black transition-colors" />
                  <span className="text-xs font-semibold text-zinc-700 group-hover:text-black tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leave Requests List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-700">
            <CalendarDays className="w-4 h-4 text-zinc-500" />
            Recent Leave Applications
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentLeaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 font-mono">
              No leave requests filed yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentLeaves.map((leave, idx) => (
                <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900 font-mono">{leave.leaveType} LEAVE</span>
                      <Badge variant={
                        leave.status === 'APPROVED' ? 'primary' :
                        leave.status === 'REJECTED' ? 'danger' : 'warning'
                      }>
                        {leave.status || 'PENDING'}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono">
                      {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                    </p>
                  </div>

                  <div className="text-xs text-zinc-600 italic bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200/80 max-w-md truncate font-mono">
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
