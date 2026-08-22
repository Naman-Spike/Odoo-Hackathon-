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
  FileCheck,
  BarChart3,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate, formatCurrency, getInitials } from '../lib/utils';
import { ExecutiveAnalyticsSuite } from '../components/analytics/ExecutiveAnalyticsSuite';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'OVERVIEW'>('ANALYTICS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Raw state collections
  const [profiles, setProfiles] = useState<any[]>([]);
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [allLeaves, setAllLeaves] = useState<any[]>([]);
  const [allPayrolls, setAllPayrolls] = useState<any[]>([]);

  // Computed metrics
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

      const profs = profilesRes.data || [];
      const atts = attendanceRes.data || [];
      const lvs = leavesRes.data || [];
      const pays = payrollRes.data || [];

      setProfiles(profs);
      setAllAttendance(atts);
      setAllLeaves(lvs);
      setAllPayrolls(pays);

      setTotalEmployees(profs.length);

      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = atts.filter((a: any) => {
        const attDate = a.workDate || a.date;
        if (!attDate) return false;
        if (typeof attDate === 'string' && attDate.startsWith(todayStr)) return true;
        const d = new Date(attDate);
        return !isNaN(d.getTime()) && d.toISOString().split('T')[0] === todayStr;
      });
      const presentCount = todayAttendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'HALF_DAY' || a.checkIn).length;
      setAttendanceStats({ present: presentCount, total: profs.length });

      const pending = lvs.filter((l: any) => l.status === 'PENDING' || !l.status);
      setPendingLeaves(pending.length);
      setRecentLeaves(lvs.slice(0, 5));

      const totalPayroll = pays.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
      setMonthlyPayroll(totalPayroll);

      const overview = profs.slice(0, 8).map((p: any) => {
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
      setError(err.response?.data?.error || 'Failed to load administrator dashboard telemetry');
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
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Synthesizing executive telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between backdrop-blur-md">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Admin Hero Banner with Mode Selector */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 border border-zinc-200/90 p-6 sm:p-8 shadow-liquid backdrop-blur-2xl specular-highlight">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-mono mb-3 backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-zinc-700" />
              <span>ADMINISTRATIVE EXECUTIVE OVERVIEW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 font-sans">
              Welcome back, {firstName}
            </h1>
            <p className="text-zinc-500 text-xs mt-1 max-w-xl font-medium">
              Real-time audit of workforce presence, visual analytics velocity, and corporate compensation structures.
            </p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 backdrop-blur-md font-mono text-xs">
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold ${
                activeTab === 'ANALYTICS'
                  ? 'bg-black text-white font-bold shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visual Intelligence</span>
            </button>
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold ${
                activeTab === 'OVERVIEW'
                  ? 'bg-black text-white font-bold shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Operational View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Executive Visual Analytics */}
      {activeTab === 'ANALYTICS' && (
        <ExecutiveAnalyticsSuite
          attendanceData={allAttendance}
          profiles={profiles}
          leaves={allLeaves}
          payrolls={allPayrolls}
        />
      )}

      {/* Mode 2: Operational Dashboard */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-fade-in">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Employees */}
            <Card hoverEffect className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Total Workforce</p>
                  <h3 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{totalEmployees}</h3>
                </div>
                <div className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Personnel Active</span>
                <span className="text-zinc-900 font-semibold">100% Verified</span>
              </div>
            </Card>

            {/* Today's Attendance */}
            <Card hoverEffect className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Shift Presence</p>
                  <h3 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{attendanceRate}%</h3>
                </div>
                <div className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Status</span>
                <span className="text-zinc-900 font-semibold">{attendanceStats.present} / {attendanceStats.total} Logged</span>
              </div>
            </Card>

            {/* Pending Leaves */}
            <Card hoverEffect className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Pending Approvals</p>
                  <h3 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">{pendingLeaves}</h3>
                </div>
                <div className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Action Required</span>
                <span className={pendingLeaves > 0 ? 'text-black font-bold' : 'text-zinc-400'}>
                  {pendingLeaves > 0 ? 'Queue Active' : 'All Clear'}
                </span>
              </div>
            </Card>

            {/* Monthly Payroll */}
            <Card hoverEffect className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Disbursed Payroll</p>
                  <h3 className="text-2xl font-extrabold text-zinc-900 mt-2 font-mono">{formatCurrency(monthlyPayroll)}</h3>
                </div>
                <div className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Compensation</span>
                <span className="text-zinc-900 font-semibold">Auto-Audited</span>
              </div>
            </Card>
          </div>

          {/* Operational Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Leave Requests */}
            <div className="lg:col-span-6">
              <Card className="h-full flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-700">
                    <FileCheck className="w-4 h-4 text-zinc-500" />
                    Recent Leave Requests
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/leave/manage')}>
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  {recentLeaves.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-400 font-mono">
                      No leave requests logged in queue.
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {recentLeaves.map((l) => (
                        <div key={l.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-[9px]">
                              {getInitials(l.user?.profile?.firstName || 'E', l.user?.profile?.lastName || '')}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-900">
                                {l.user?.profile?.firstName} {l.user?.profile?.lastName}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                {l.leaveType} • {formatDate(l.startDate)} - {formatDate(l.endDate)}
                              </div>
                            </div>
                          </div>
                          <Badge variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}>
                            {l.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Employee Roster Status */}
            <div className="lg:col-span-6">
              <Card className="h-full flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-700">
                    <Users className="w-4 h-4 text-zinc-500" />
                    Personnel Roster Telemetry
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
                    <span>Directory</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <div className="divide-y divide-zinc-100">
                    {employeesOverview.map((emp) => (
                      <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-[9px]">
                            {getInitials(emp.name, '')}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">{emp.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{emp.designation} • {emp.department}</div>
                          </div>
                        </div>
                        <Badge variant={emp.isPresent ? 'success' : 'default'}>
                          {emp.isPresent ? 'Present Today' : 'Off-Duty'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
