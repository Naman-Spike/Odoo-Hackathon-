import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Calendar, FileText, User } from 'lucide-react';
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
    <Card hoverEffect className="border-l-4 border-l-amber-500 border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-indigo-500/20">
                {getInitials(empName, '')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{empName}</h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {leave.user?.employeeId || 'EMP'} • {profile?.department || 'General'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                {leave.leaveType} LEAVE
              </span>
              <span className="flex items-center text-slate-700 gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
              </span>
              <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono">
                {days} Day{days > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 flex gap-2 border border-slate-100">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <p className="leading-relaxed">{leave.reason}</p>
            </div>
          </div>

          <div className="lg:w-80 flex flex-col justify-between space-y-3 pt-2 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Admin Notes / Remarks
              </label>
              <textarea
                className="w-full text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-2.5 bg-slate-50/50 hover:bg-white focus:bg-white resize-none transition-colors"
                placeholder="Optional review remarks for employee..."
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
                className="flex-1"
                icon={XCircle}
                onClick={() => onReject(leave.id, remarks)}
                isLoading={isProcessing}
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                className="flex-1 shadow-glow-success"
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
