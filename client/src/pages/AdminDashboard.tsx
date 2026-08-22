import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate, formatCurrency, getInitials } from '../lib/utils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, total: 0 });
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
  const [employeesOverview, setEmployeesOverview] = useState<any[]>([]);

  const firstName = user?.profile?.firstName || 'Admin';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profilesRes, attendanceRes, leavesRes, payrollRes] = await Promise.all([
        api.get('/profile/'),
        api.get('/attendance/all'),
        api.get('/leaves/all').catch(() => api.get('/leaves/')),
        api.get('/payroll/all')
      ]);

      const profiles = profilesRes.data || [];
      setTotalEmployees(profiles.length);

      const allAttendance = attendanceRes.data || [];
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = allAttendance.filter((a: any) => {
        const attDate = a.workDate || a.date;
        return attDate && attDate.startsWith(todayStr);
      });
      const presentCount = todayAttendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'HALF_DAY' || a.checkIn).length;
      setAttendanceStats({ present: presentCount, total: profiles.length });

      const leaves = leavesRes.data || [];
      const pending = leaves.filter((l: any) => l.status === 'PENDING' || !l.status);
      setPendingLeaves(pending.length);
      setRecentLeaves(leaves.slice(0, 5));

      const payrolls = payrollRes.data || [];
      const totalPayroll = payrolls.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
      setMonthlyPayroll(totalPayroll);

      const overview = profiles.slice(0, 8).map((p: any) => {
        const isPresent = todayAttendance.some((a: any) => a.userId === (p.userId || p.user?.id) && (a.status === 'PRESENT' || a.checkIn));
        return {
          id: p.id || p.userId,
          name: `${p.firstName} ${p.lastName}`,
          department: p.department || 'General',
          designation: p.designation || 'Staff',
          avatarUrl: p.avatarUrl,
          employeeId: p.user?.employeeId || p.employeeId || 'EMP',
          isPresent
        };
      });
      setEmployeesOverview(overview);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load administrator dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const attendanceRate = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Syncing organization telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center justify-between backdrop-blur-md">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Admin Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 shadow-liquid backdrop-blur-2xl specular-highlight">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 text-[11px] font-mono mb-3 backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-zinc-300" />
              <span>ADMINISTRATIVE EXECUTIVE OVERVIEW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              Welcome back, {firstName}
            </h1>
            <p className="text-zinc-400 text-xs mt-1 max-w-xl font-medium">
              Real-time audit of workforce presence, pending approval queues, and corporate compensation structures.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/leave/manage')} 
              variant="primary" 
              size="sm"
              icon={FileCheck}
            >
              Review Leaves ({pendingLeaves})
            </Button>
            <Button 
              onClick={() => navigate('/attendance')} 
              variant="outline" 
              size="sm"
              icon={Clock}
            >
              Audit Ledger
            </Button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Employees */}
        <Card hoverEffect className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Total Workforce</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{totalEmployees}</h3>
            </div>
            <div className="p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Personnel Active</span>
            <span className="text-zinc-300">100% Verified</span>
          </div>
        </Card>

        {/* Today's Attendance */}
        <Card hoverEffect className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Shift Presence</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{attendanceRate}%</h3>
            </div>
            <div className="p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Status</span>
            <span className="text-zinc-300">{attendanceStats.present} / {attendanceStats.total} Logged</span>
          </div>
        </Card>

        {/* Pending Leaves */}
        <Card hoverEffect className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Pending Approvals</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{pendingLeaves}</h3>
            </div>
            <div className="p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Action Required</span>
            <span className={pendingLeaves > 0 ? 'text-white font-bold' : 'text-zinc-500'}>
              {pendingLeaves > 0 ? 'Queue Active' : 'All Clear'}
            </span>
          </div>
        </Card>

        {/* Monthly Payroll */}
        <Card hoverEffect className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Disbursed Payroll</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{formatCurrency(monthlyPayroll)}</h3>
            </div>
            <div className="p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Compensation</span>
            <span className="text-zinc-300">Auto-Audited</span>
          </div>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Leave Requests */}
        <div className="lg:col-span-6">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-300">
                <FileCheck className="w-4 h-4 text-zinc-400" />
                Recent Leave Requests
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/leave/manage')}>
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {recentLeaves.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                  No leave requests logged in queue.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.03] border-b border-white/[0.06] text-zinc-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Staff</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {recentLeaves.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">
                            {leave.user?.profile?.firstName ? `${leave.user.profile.firstName} ${leave.user.profile.lastName}` : leave.employeeName || 'Staff Member'}
                          </td>
                          <td className="px-4 py-3 font-mono text-zinc-400">{leave.leaveType}</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant={
                              leave.status === 'APPROVED' ? 'primary' :
                              leave.status === 'REJECTED' ? 'danger' : 'warning'
                            }>
                              {leave.status || 'PENDING'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Employee Overview Table */}
        <div className="lg:col-span-6">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-300">
                <Users className="w-4 h-4 text-zinc-400" />
                Team Presence Today
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
                <span>Directory</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-white/[0.06] text-zinc-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Team Member</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {employeesOverview.map((emp) => (
                      <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded-lg bg-white text-black font-bold text-[9px] flex items-center justify-center">
                              {getInitials(emp.name, '')}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{emp.name}</div>
                              <div className="text-[10px] text-zinc-500 font-mono">{emp.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">{emp.department}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={emp.isPresent ? 'primary' : 'default'}>
                            {emp.isPresent ? 'Active Today' : 'Absent'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
