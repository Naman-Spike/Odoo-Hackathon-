import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Save, User, ShieldAlert } from 'lucide-react';

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
    <Card className="max-w-4xl mx-auto shadow-liquid rounded-3xl overflow-hidden">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2 text-zinc-300">
            <User className="w-4 h-4 text-zinc-400" />
            Edit Profile Parameters
          </CardTitle>
          {!isAdmin && (
            <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-zinc-400" />
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
              className={!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}
              required
            />
            
            <Input 
              label="Last Name"
              name="lastName" 
              value={formData.lastName || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}
              required
            />

            <Input 
              label="Contact Phone"
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              placeholder="+91 98765 43210"
            />

            <Input 
              label="Residential Location"
              name="address" 
              value={formData.address || ''} 
              onChange={handleChange} 
              placeholder="Apartment, City, Country"
            />

            <Input 
              label="Division / Department"
              name="department" 
              value={formData.department || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}
            />

            <Input 
              label="Designation / Title"
              name="designation" 
              value={formData.designation || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}
            />

            <Input 
              label="Joining Date"
              type="date"
              name="joiningDate" 
              value={formData.joiningDate || ''} 
              onChange={handleChange} 
              disabled={!isAdmin}
              className={!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}
            />

            <Input 
              label="Avatar Image URL"
              name="avatarUrl" 
              value={formData.avatarUrl || ''} 
              onChange={handleChange} 
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save}>
              Save Parameters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
