import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Building, Calendar, Hash, Shield, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
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
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const showEdit = isOwnProfile || isAdmin;

  const getAvatarBg = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={fullName} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover bg-white"
                />
              ) : (
                <div className={`w-24 h-24 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-white ${getAvatarBg(fullName)}`}>
                  {getInitials(fullName)}
                </div>
              )}
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-gray-500 font-medium">{profile.designation || 'Employee'}</p>
              </div>
            </div>
            {showEdit && (
              <Button onClick={onEdit} variant="outline" className="mb-2">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gray-50 rounded-md">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email Address</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gray-50 rounded-md">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone Number</div>
                  <div className="font-medium">{profile.phone || 'Not provided'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gray-50 rounded-md">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="font-medium">{profile.address || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Work Information</h3>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Hash className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Employee ID</div>
                  <div className="font-medium">{user.employeeId}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Department</div>
                  <div className="font-medium">{profile.department || 'Not assigned'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Joining Date</div>
                  <div className="font-medium">{profile.joiningDate ? formatDate(profile.joiningDate) : 'Not recorded'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-purple-50 rounded-md">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">System Role</div>
                  <div className="font-medium capitalize">{user.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
