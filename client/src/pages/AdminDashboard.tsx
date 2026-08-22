import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Loader2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
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
  const currentDate = new Date();

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
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading HR metrics & company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-semibold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Admin Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 translate-y-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HR Administrative Executive View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {firstName} 📊
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Overview of staff attendance, leave approval requests, and compensation structures across all departments.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/leave/manage')} 
              variant="gradient" 
              size="sm"
              icon={FileCheck}
            >
              Review Leaves ({pendingLeaves})
            </Button>
            <Button 
              onClick={() => navigate('/attendance')} 
              variant="outline" 
              size="sm"
              className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
              icon={Clock}
            >
              Live Logs
            </Button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Employees */}
        <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-blue-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Total Workforce</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalEmployees}</h3>
            </div>
            <div className="p-3 bg-blue-100/80 text-blue-700 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between text-xs text-slate-500">
            <span>Active Staff</span>
            <span className="font-semibold text-blue-700">100% Onboarded</span>
          </div>
        </Card>

        {/* Today's Attendance */}
        <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Today's Attendance</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{attendanceRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-100/80 text-emerald-700 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs text-slate-500">
            <span>Check-in Count</span>
            <span className="font-semibold text-emerald-700">{attendanceStats.present} / {attendanceStats.total} Present</span>
          </div>
        </Card>

        {/* Pending Leaves */}
        <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-amber-50/30 border-amber-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Approvals</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{pendingLeaves}</h3>
            </div>
            <div className="p-3 bg-amber-100/80 text-amber-700 rounded-2xl">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs text-slate-500">
            <span>Action Required</span>
            <span className={`font-semibold ${pendingLeaves > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {pendingLeaves > 0 ? 'Review Queue' : 'All Clear'}
            </span>
          </div>
        </Card>

        {/* Monthly Payroll */}
        <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-purple-50/30 border-purple-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Monthly Payroll</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(monthlyPayroll)}</h3>
            </div>
            <div className="p-3 bg-purple-100/80 text-purple-700 rounded-2xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-slate-500">
            <span>Net Salaries</span>
            <span className="font-semibold text-purple-700">Auto-Calculated</span>
          </div>
        </Card>
      </div>

      {/* Tables Grid: Recent Leave Requests + Employee Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Leave Requests */}
        <div className="lg:col-span-6">
          <Card className="border-slate-200 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Recent Leave Requests
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/leave/manage')}>
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {recentLeaves.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No leave requests found in the system.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLeaves.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {leave.user?.profile?.firstName ? `${leave.user.profile.firstName} ${leave.user.profile.lastName}` : leave.employeeName || 'Staff Member'}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-600">{leave.leaveType}</td>
                          <td className="px-4 py-3 text-slate-500">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant={
                              leave.status === 'APPROVED' ? 'success' :
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
          <Card className="border-slate-200 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
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
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Team Member</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3 text-right">Today's Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeesOverview.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                              {getInitials(emp.name, '')}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{emp.name}</div>
                              <div className="text-[10px] text-slate-400">{emp.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{emp.department}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={emp.isPresent ? 'success' : 'default'}>
                            {emp.isPresent ? 'Present Today' : 'Absent'}
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
