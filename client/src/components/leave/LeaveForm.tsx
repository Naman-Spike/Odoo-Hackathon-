import React, { useState, useMemo } from 'react';
import { Calendar, Info, AlertTriangle, Send } from 'lucide-react';
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

  const paidRemaining = balance?.paid?.remaining ?? (balance?.paid as any)?.balance ?? 12;
  const sickRemaining = balance?.sick?.remaining ?? (balance?.sick as any)?.balance ?? 6;

  const leaveOptions = [
    { value: 'PAID', label: `Paid Annual Leave (Available: ${paidRemaining} days)` },
    { value: 'SICK', label: `Sick Leave (Available: ${sickRemaining} days)` },
    { value: 'UNPAID', label: 'Unpaid Leave (Unlimited Quota)' }
  ];

  const warning = useMemo(() => {
    if (days > 0 && balance) {
      if (leaveType === 'PAID' && days > paidRemaining) return `Requested ${days} days exceeds your ${paidRemaining} remaining Paid leave days.`;
      if (leaveType === 'SICK' && days > sickRemaining) return `Requested ${days} days exceeds your ${sickRemaining} remaining Sick leave days.`;
    }
    return null;
  }, [leaveType, days, balance, paidRemaining, sickRemaining]);

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
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-mono">
          {error}
        </div>
      )}
      
      <Select
        label="Select Leave Classification"
        options={leaveOptions}
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          min={today}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          min={startDate || today}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      {days > 0 && (
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono flex items-center justify-between text-zinc-700">
          <span className="flex items-center gap-1.5 font-medium">
            <Info className="w-4 h-4 text-zinc-500" /> Total Duration:
          </span>
          <span className="font-bold text-zinc-900 bg-white px-2.5 py-0.5 rounded-lg border border-zinc-200">
            {days} {days === 1 ? 'Working Day' : 'Working Days'}
          </span>
        </div>
      )}

      {warning && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>{warning}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
          Application Reason & Details
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="State the context or purpose of your leave request..."
          className="w-full text-xs font-mono border border-zinc-200 rounded-xl p-3 bg-white/90 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors resize-none shadow-sm"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" icon={Send} isLoading={isSubmitting}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};
