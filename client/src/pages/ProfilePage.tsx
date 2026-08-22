import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ProfileView from '../components/profile/ProfileView';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import { Loader2, Users, Search, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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
      showToast('Failed to load profile telemetry', 'error');
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
      
      showToast('Profile parameters updated successfully!', 'success');
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
        <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-liquid font-mono text-xs flex items-center gap-2 animate-slide-up border backdrop-blur-2xl ${
          toast.type === 'success' ? 'bg-white/10 text-white border-white/20' : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toast.message}</span>
        </div>
      )}

      {isAdmin && !viewingProfile && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-sans flex items-center gap-2">
                <Users className="w-6 h-6 text-zinc-400" />
                Employee Directory
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">Verified database of all registered corporate personnel</p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                placeholder="Search staff, designation, department..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs font-mono rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-zinc-600 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-colors shadow-inner backdrop-blur-md"
              />
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-liquid backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="px-4 py-3.5">Staff Identity</th>
                    <th className="px-4 py-3.5">Division</th>
                    <th className="px-4 py-3.5">Designation</th>
                    <th className="px-4 py-3.5">Contact Telemetry</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-zinc-500 font-mono">
                        No personnel matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const empName = `${emp.firstName || 'Staff'} ${emp.lastName || ''}`;

                      return (
                        <tr key={emp.id || emp.userId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {emp.avatarUrl ? (
                                <img src={emp.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20" />
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-[10px] shadow-specular">
                                  {getInitials(empName, '')}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white">{empName}</div>
                                <div className="text-[10px] text-zinc-500 font-mono">ID: {emp.user?.employeeId || emp.employeeId || 'EMP'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-zinc-300 text-[11px]">{emp.department || 'General'}</td>
                          <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">{emp.designation || 'Staff'}</td>
                          <td className="px-4 py-3.5 font-mono text-zinc-500 text-[11px]">{emp.phone || '+91 98765 43210'}</td>
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
          </div>
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
