import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ProfileView from '../components/profile/ProfileView';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import { Loader2, Users, Search, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
        setViewingProfile(res.data.profile);
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
           employeeId: emp.employeeId || 'N/A',
           email: emp.email || 'user@example.com',
           role: emp.role || 'employee'
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
      
      showToast('Profile updated successfully', 'success');
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
    return (
      (emp.firstName || '').toLowerCase().includes(term) ||
      (emp.lastName || '').toLowerCase().includes(term) ||
      (emp.department || '').toLowerCase().includes(term) ||
      (emp.designation || '').toLowerCase().includes(term)
    );
  });

  if (loading && !viewingProfile && !employees.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg font-medium ${
          toast.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {toast.message}
        </div>
      )}

      {isAdmin && !viewingProfile && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> Employee Directory
            </h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search employees..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card className="shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No employees found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <TableRow key={emp.id || emp.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {emp.avatarUrl ? (
                              <img src={emp.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {(emp.firstName?.[0] || '') + (emp.lastName?.[0] || '')}
                              </div>
                            )}
                            <div className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{emp.department || '-'}</TableCell>
                        <TableCell>{emp.designation || '-'}</TableCell>
                        <TableCell className="text-sm text-gray-500">{emp.phone || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewEmployee(emp.id, emp.userId)}>
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {viewingProfile && viewingUser && (
        <div className="space-y-4">
          {isAdmin && (
            <Button variant="outline" onClick={handleBackToList} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
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
