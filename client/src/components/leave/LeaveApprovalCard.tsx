import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Calendar, FileText } from 'lucide-react';
import { formatDate, calculateDaysBetween, getInitials } from '../../lib/utils';

interface LeaveApprovalCardProps {
  leave: any;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
  isProcessing: boolean;
}

export const LeaveApprovalCard: React.FC<LeaveApprovalCardProps> = ({ leave, onApprove, onReject, isProcessing }) => {
  const [remarks, setRemarks] = useState('');
  const days = calculateDaysBetween(new Date(leave.startDate), new Date(leave.endDate)) + 1;
  const profile = leave.user?.profile;
  const empName = profile ? `${profile.firstName} ${profile.lastName}` : 'Staff Member';

  return (
    <Card hoverEffect className="border-l-4 border-l-black border-zinc-200 shadow-liquid overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(empName, '')}
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">{empName}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {leave.user?.employeeId || 'EMP'} • {profile?.department || 'General'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                {leave.leaveType} LEAVE
              </span>
              <span className="flex items-center text-zinc-700 gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
              </span>
              <span className="text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md text-[11px]">
                {days} Day{days > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-zinc-50 p-3 rounded-xl text-xs text-zinc-700 flex gap-2 border border-zinc-200/80 font-mono">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-400" />
              <p className="leading-relaxed">{leave.reason}</p>
            </div>
          </div>

          <div className="lg:w-80 flex flex-col justify-between space-y-3 pt-2 lg:pt-0 lg:border-l lg:border-zinc-200/80 lg:pl-6">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Administrative Notes
              </label>
              <textarea
                className="w-full text-xs border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black/10 focus:border-black p-2.5 bg-white/90 text-zinc-900 placeholder:text-zinc-400 resize-none transition-colors font-mono"
                placeholder="Optional remarks for applicant..."
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="danger"
                size="sm"
                className="flex-1 font-mono text-xs"
                icon={XCircle}
                onClick={() => onReject(leave.id, remarks)}
                isLoading={isProcessing}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 font-mono text-xs"
                icon={CheckCircle}
                onClick={() => onApprove(leave.id, remarks)}
                isLoading={isProcessing}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
