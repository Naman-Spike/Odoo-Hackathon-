import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Building, Calendar, Hash, Shield, Edit, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getInitials, formatDate } from '../../lib/utils';

interface ProfileData {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
}

interface UserData {
  employeeId: string;
  email: string;
  role: string;
}

interface ProfileViewProps {
  profile: ProfileData;
  user: UserData;
  isOwnProfile: boolean;
  isAdmin: boolean;
  onEdit: () => void;
}

export default function ProfileView({ profile, user, isOwnProfile, isAdmin, onEdit }: ProfileViewProps) {
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Employee';
  const showEdit = isOwnProfile || isAdmin;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-3xl">
        {/* Cover Photo Gradient Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8 relative">
          {/* Avatar & Header Details Row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={fullName} 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg object-cover bg-white ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-tr from-indigo-600 to-purple-600 ring-2 ring-indigo-500/20">
                  {getInitials(fullName, '')}
                </div>
              )}
              
              <div className="pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{fullName}</h1>
                  <Badge variant={user.role === 'ADMIN' ? 'purple' : 'primary'}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {profile.designation || 'Staff Member'} • <span className="text-indigo-600">{profile.department || 'General'}</span>
                </p>
              </div>
            </div>

            {showEdit && (
              <Button onClick={onEdit} variant="outline" size="sm" icon={Edit} className="self-center sm:self-auto">
                Edit Profile
              </Button>
            )}
          </div>

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100">
            {/* Personal Info Box */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Contact & Personal Particulars
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-indigo-600 border border-slate-200/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Work Email</div>
                    <div className="font-bold text-slate-900">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-indigo-600 border border-slate-200/60">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Mobile Contact</div>
                    <div className="font-bold text-slate-900">{profile.phone || '+91 98765 43210 (Default)'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-indigo-600 border border-slate-200/60">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Residential Address</div>
                    <div className="font-bold text-slate-900">{profile.address || 'Tech City, Sector 62, Noida, India'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work & Employment Box */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Organizational Details
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-purple-600 border border-slate-200/60">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Employee ID</div>
                    <div className="font-mono font-bold text-slate-900">{user.employeeId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-purple-600 border border-slate-200/60">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Assigned Department</div>
                    <div className="font-bold text-slate-900">{profile.department || 'Engineering'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs text-purple-600 border border-slate-200/60">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Joining Date</div>
                    <div className="font-bold text-slate-900">{profile.joiningDate ? formatDate(profile.joiningDate) : 'Jan 15, 2024'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
