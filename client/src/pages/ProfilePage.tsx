import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ProfileView from '../components/profile/ProfileView';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import { Loader2, Users, Search, ArrowLeft, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getInitials } from '../lib/utils';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [isAdmin]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const res = await api.get('/profile/');
        setEmployees(res.data || []);
      } else {
        const res = await api.get('/profile/me');
        setViewingProfile(res.data.profile || {});
        setViewingUser({
          employeeId: res.data.employeeId,
          email: res.data.email,
          role: res.data.role
        });
      }
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewEmployee = async (employeeId: string, userId: string) => {
    setLoading(true);
    try {
      const emp = employees.find(e => e.id === employeeId || e.userId === userId);
      if (emp) {
         setViewingProfile(emp);
         setViewingUser({
           employeeId: emp.user?.employeeId || emp.employeeId || 'EMP',
           email: emp.user?.email || emp.email || 'user@dayflow.com',
           role: emp.user?.role || emp.role || 'EMPLOYEE'
         });
      }
    } catch (err) {
      showToast('Failed to load employee details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: any) => {
    try {
      if (isAdmin && viewingProfile && viewingProfile.userId !== user?.id) {
        await api.put(`/profile/${viewingProfile.userId}`, data);
      } else {
        await api.put('/profile/me', data);
      }
      
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      
      if (isAdmin && viewingProfile && viewingProfile.userId !== user?.id) {
        const res = await api.get('/profile/');
        setEmployees(res.data || []);
        const updated = res.data.find((e: any) => e.userId === viewingProfile.userId);
        if (updated) setViewingProfile(updated);
      } else {
        const res = await api.get('/profile/me');
        setViewingProfile(res.data.profile);
      }
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleBackToList = () => {
    setViewingProfile(null);
    setViewingUser(null);
    setIsEditing(false);
  };

  const filteredEmployees = employees.filter(emp => {
    const term = search.toLowerCase();
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const dept = (emp.department || '').toLowerCase();
    const desig = (emp.designation || '').toLowerCase();
    const id = (emp.user?.employeeId || emp.employeeId || '').toLowerCase();
    return name.includes(term) || dept.includes(term) || desig.includes(term) || id.includes(term);
  });

  if (loading && !viewingProfile && !employees.length) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl font-medium text-xs flex items-center gap-2 animate-slide-up border ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast.message}</span>
        </div>
      )}

      {isAdmin && !viewingProfile && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                Employee Directory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive database of all registered organization personnel</p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search staff, designation, department..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-slate-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-2xs"
              />
            </div>
          </div>

          <Card className="shadow-2xs border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Team Member</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Designation</th>
                    <th className="px-4 py-3.5">Contact Phone</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        No team members matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const empName = `${emp.firstName || 'Staff'} ${emp.lastName || ''}`;

                      return (
                        <tr key={emp.id || emp.userId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {emp.avatarUrl ? (
                                <img src={emp.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                  {getInitials(empName, '')}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-900">{empName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: {emp.user?.employeeId || emp.employeeId || 'EMP'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">{emp.department || 'General'}</td>
                          <td className="px-4 py-3.5 text-slate-600">{emp.designation || 'Staff'}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{emp.phone || '+91 98765 43210'}</td>
                          <td className="px-4 py-3.5 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleViewEmployee(emp.id, emp.userId)}>
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {viewingProfile && viewingUser && (
        <div className="space-y-4">
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleBackToList} icon={ArrowLeft}>
              Back to Employee Directory
            </Button>
          )}
          
          {isEditing ? (
            <ProfileEditForm 
              profile={viewingProfile}
              isAdmin={isAdmin}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView 
              profile={viewingProfile}
              user={viewingUser}
              isOwnProfile={viewingProfile.userId === user?.id || !isAdmin}
              isAdmin={isAdmin}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
