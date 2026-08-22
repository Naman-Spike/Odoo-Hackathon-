import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Save, X, Sparkles, User, ShieldAlert } from 'lucide-react';

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

interface ProfileEditFormProps {
  profile: ProfileData;
  isAdmin: boolean;
  onSave: (data: Partial<ProfileData>) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, isAdmin, onSave, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    address: profile.address || '',
    avatarUrl: profile.avatarUrl || '',
    department: profile.department || '',
    designation: profile.designation || '',
    joiningDate: profile.joiningDate ? profile.joiningDate.split('T')[0] : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-sm border-slate-200 rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/60 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Edit Profile Information
          </CardTitle>
          {!isAdmin && (
            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Role Restricted: Employment fields locked
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input 
              label="First Name"
              name="firstName" 
              value={formData.firstName || ''} 
              onChange={handleChange} 
              disabled={!isAdmin} 
              className={!isAdmin ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}
              required
            />
            
            <Input 
              label="Last Name"
              name="lastName" 
              value={formData.lastName || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}
              required
            />

            <Input 
              label="Mobile Phone Number"
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              placeholder="+91 98765 43210"
            />

            <Input 
              label="Residential Address"
              name="address" 
              value={formData.address || ''} 
              onChange={handleChange} 
              placeholder="Apartment, Street, City, Country"
            />

            <Input 
              label="Department"
              name="department" 
              value={formData.department || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}
            />

            <Input 
              label="Designation / Title"
              name="designation" 
              value={formData.designation || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}
            />

            <Input 
              label="Joining Date"
              type="date"
              name="joiningDate" 
              value={formData.joiningDate || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}
            />

            <Input 
              label="Avatar Profile Image URL"
              name="avatarUrl" 
              value={formData.avatarUrl || ''} 
              onChange={handleChange} 
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
