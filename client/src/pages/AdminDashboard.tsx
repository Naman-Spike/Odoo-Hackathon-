import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CalendarDays, Wallet, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { formatDate, formatCurrency } from '../lib/utils';

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
        api.get('/leaves/'),
        api.get('/payroll/all')
      ]);

      const profiles = profilesRes.data || [];
      setTotalEmployees(profiles.length);

      const allAttendance = attendanceRes.data || [];
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = allAttendance.filter((a: any) => a.date.startsWith(todayStr));
      const presentCount = todayAttendance.filter((a: any) => a.status === 'Present' || a.checkIn).length;
      setAttendanceStats({ present: presentCount, total: profiles.length });

      const leaves = leavesRes.data || [];
      const pending = leaves.filter((l: any) => l.status === 'Pending' || !l.status);
      setPendingLeaves(pending.length);
      setRecentLeaves(leaves.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5));

      const payrolls = payrollRes.data || [];
      const currentMonth = new Date().getMonth();
      const thisMonthPayrolls = payrolls.filter((p: any) => new Date(p.month || Date.now()).getMonth() === currentMonth);
      const totalPayroll = thisMonthPayrolls.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
      setMonthlyPayroll(totalPayroll);

      const overview = profiles.slice(0, 10).map((p: any) => {
        const isPresent = todayAttendance.some((a: any) => a.userId === p.userId && (a.status === 'Present' || a.checkIn));
        return {
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          department: p.department || 'N/A',
          designation: p.designation || 'N/A',
          isPresent
        };
      });
      setEmployeesOverview(overview);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const attendanceRate = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}</h1>
        <p className="text-slate-400">HR Dashboard • {formatDate(currentDate.toISOString(), true)}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-0 shadow-sm ring-1 ring-blue-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Employees</p>
                <h3 className="text-3xl font-bold text-gray-900">{totalEmployees}</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-0 shadow-sm ring-1 ring-emerald-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">Today's Attendance</p>
                <h3 className="text-3xl font-bold text-gray-900">{attendanceRate}%</h3>
                <p className="text-xs text-emerald-600 mt-1">{attendanceStats.present} / {attendanceStats.total} present</p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-0 shadow-sm ring-1 ring-orange-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Pending Leaves</p>
                <h3 className="text-3xl font-bold text-gray-900">{pendingLeaves}</h3>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-0 shadow-sm ring-1 ring-purple-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Monthly Payroll</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyPayroll)}</h3>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div onClick={() => navigate('/leave/manage')} className="cursor-pointer bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
            <CalendarDays className="w-6 h-6" />
          </div>
          <span className="font-semibold text-gray-700">Review Leave Requests</span>
        </div>
        <div onClick={() => navigate('/attendance')} className="cursor-pointer bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
            <Clock className="w-6 h-6" />
          </div>
          <span className="font-semibold text-gray-700">Manage Attendance</span>
        </div>
        <div onClick={() => navigate('/payroll/manage')} className="cursor-pointer bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="font-semibold text-gray-700">Payroll Management</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeaves.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No recent requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeaves.map((leave, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{leave.employeeName || 'Unknown'}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {leave.status || 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Overview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status Today</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesOverview.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{emp.designation}</div>
                          <div className="text-xs text-gray-500">{emp.department}</div>
                        </TableCell>
                        <TableCell>
                           {emp.isPresent ? (
                             <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                               Present
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
                               Absent
                             </span>
                           )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
