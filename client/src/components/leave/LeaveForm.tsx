import React, { useState, useMemo } from 'react';
import { Calendar, AlignLeft, Info, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { calculateDaysBetween } from '../../lib/utils';

interface LeaveBalance {
  paid: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  unpaid: { total: string; used: number; remaining: string };
}

interface LeaveFormProps {
  onSubmit: (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => Promise<void>;
  onCancel: () => void;
  balance: LeaveBalance | null;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSubmit, onCancel, balance }) => {
  const [leaveType, setLeaveType] = useState('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        return calculateDaysBetween(start, end) + 1; // inclusive
      }
    }
    return 0;
  }, [startDate, endDate]);

  const leaveOptions = [
    { value: 'PAID', label: `Paid Leave (Remaining: ${balance?.paid.remaining ?? 0})` },
    { value: 'SICK', label: `Sick Leave (Remaining: ${balance?.sick.remaining ?? 0})` },
    { value: 'UNPAID', label: 'Unpaid Leave (Unlimited)' }
  ];

  const warning = useMemo(() => {
    if (days > 0 && balance) {
      if (leaveType === 'PAID' && days > balance.paid.remaining) return 'This exceeds your remaining Paid Leave balance.';
      if (leaveType === 'SICK' && days > balance.sick.remaining) return 'This exceeds your remaining Sick Leave balance.';
    }
    return null;
  }, [leaveType, days, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    if (reason.length < 10) {
      setError('Reason must be at least 10 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ leaveType, startDate, endDate, reason });
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      <Select
        label="Leave Type"
        options={leaveOptions}
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
          icon={Calendar}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          min={startDate || today}
          onChange={(e) => setEndDate(e.target.value)}
          icon={Calendar}
          required
        />
      </div>

      {days > 0 && (
        <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
          <Info className="w-4 h-4 mr-2" />
          Applying for {days} day{days > 1 ? 's' : ''} of leave.
        </div>
      )}

      {warning && (
        <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md">
          <AlertTriangle className="w-4 h-4 mr-2" />
          {warning}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400">
            <AlignLeft className="h-5 w-5" />
          </div>
          <textarea
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-24 resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a valid reason..."
            required
            minLength={10}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};
