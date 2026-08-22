import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Save, X } from 'lucide-react';

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
    <Card className="max-w-4xl mx-auto shadow-md border-0">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-xl">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input 
                name="firstName" 
                value={formData.firstName || ''} 
                onChange={handleChange} 
                disabled={!isAdmin} 
                className={!isAdmin ? 'bg-gray-100 text-gray-500' : ''}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input 
                name="lastName" 
                value={formData.lastName || ''} 
                onChange={handleChange} 
                disabled={!isAdmin}
                className={!isAdmin ? 'bg-gray-100 text-gray-500' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <Input 
                name="address" 
                value={formData.address || ''} 
                onChange={handleChange} 
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Input 
                name="department" 
                value={formData.department || ''} 
                onChange={handleChange} 
                disabled={!isAdmin}
                className={!isAdmin ? 'bg-gray-100 text-gray-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Designation</label>
              <Input 
                name="designation" 
                value={formData.designation || ''} 
                onChange={handleChange} 
                disabled={!isAdmin}
                className={!isAdmin ? 'bg-gray-100 text-gray-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Joining Date</label>
              <Input 
                type="date"
                name="joiningDate" 
                value={formData.joiningDate || ''} 
                onChange={handleChange} 
                disabled={!isAdmin}
                className={!isAdmin ? 'bg-gray-100 text-gray-500' : ''}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Avatar URL</label>
              <Input 
                name="avatarUrl" 
                value={formData.avatarUrl || ''} 
                onChange={handleChange} 
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Provide a valid image URL for the profile picture.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
