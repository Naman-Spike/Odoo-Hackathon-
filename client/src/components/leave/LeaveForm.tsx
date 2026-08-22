import React, { useState, useMemo } from 'react';
import { Calendar, AlignLeft, Info, AlertTriangle, Send } from 'lucide-react';
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
    { value: 'PAID', label: `Paid Annual Leave (Available: ${balance?.paid.remaining ?? 12})` },
    { value: 'SICK', label: `Sick Leave (Available: ${balance?.sick.remaining ?? 6})` },
    { value: 'UNPAID', label: 'Unpaid Leave (Unlimited Quota)' }
  ];

  const warning = useMemo(() => {
    if (days > 0 && balance) {
      if (leaveType === 'PAID' && days > balance.paid.remaining) return `Requested ${days} days exceeds your ${balance.paid.remaining} remaining Paid leave days.`;
      if (leaveType === 'SICK' && days > balance.sick.remaining) return `Requested ${days} days exceeds your ${balance.sick.remaining} remaining Sick leave days.`;
    }
    return null;
  }, [leaveType, days, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate || !reason) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot precede the start date.');
      return;
    }
    if (reason.trim().length < 8) {
      setError('Please provide a descriptive reason (minimum 8 characters).');
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
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}
      
      <Select
        label="Select Leave Type"
        options={leaveOptions}
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="flex items-center text-xs font-semibold text-indigo-700 bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
          <Info className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-600" />
          <span>Applying for <strong>{days} calendar day{days > 1 ? 's' : ''}</strong> of leave.</span>
        </div>
      )}

      {warning && (
        <div className="flex items-center text-xs font-semibold text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 text-amber-600" />
          <span>{warning}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason for Leave</label>
        <div className="relative">
          <textarea
            className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs text-slate-900 placeholder:text-slate-400 h-24 resize-none transition-all shadow-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g., Attending family function, medical appointment..."
            required
            minLength={8}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="gradient" type="submit" isLoading={isSubmitting} icon={Send}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};
