import React from 'react';
import { Mail, Phone, MapPin, Building, Calendar, Hash, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
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
      <Card className="shadow-liquid overflow-hidden rounded-3xl">
        {/* Cover Photo Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8 relative">
          {/* Avatar & Details Row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={fullName} 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-white/40 shadow-2xl object-cover bg-black ring-1 ring-white/20"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-white/40 shadow-2xl flex items-center justify-center text-3xl font-extrabold text-black bg-white ring-1 ring-white/20 shadow-specular">
                  {getInitials(fullName, '')}
                </div>
              )}
              
              <div className="pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight font-sans">{fullName}</h1>
                  <Badge variant={user.role === 'ADMIN' ? 'primary' : 'glass'}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {profile.designation || 'Staff Member'} • <span className="text-white">{profile.department || 'General'}</span>
                </p>
              </div>
            </div>

            {showEdit && (
              <Button onClick={onEdit} variant="outline" size="sm" icon={Edit} className="self-center sm:self-auto">
                Edit Information
              </Button>
            )}
          </div>

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10">
            {/* Personal Info Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4 font-mono text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Contact Parameters
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Work Email</div>
                    <div className="font-bold text-white mt-0.5">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Mobile Contact</div>
                    <div className="font-bold text-white mt-0.5">{profile.phone || '+91 98765 43210'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Location</div>
                    <div className="font-bold text-white mt-0.5">{profile.address || 'Tech City, Sector 62, Noida, India'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work & Employment Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4 font-mono text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Organization Metrics
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Staff ID</div>
                    <div className="font-bold text-white mt-0.5">{user.employeeId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Division</div>
                    <div className="font-bold text-white mt-0.5">{profile.department || 'Engineering'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-xl border border-white/10 text-zinc-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">Onboarding Date</div>
                    <div className="font-bold text-white mt-0.5">{profile.joiningDate ? formatDate(profile.joiningDate) : 'Jan 15, 2024'}</div>
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
