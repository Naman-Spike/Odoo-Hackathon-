import React from 'react';
import { CalendarOff, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, calculateDaysBetween, getInitials } from '../../lib/utils';
import { Card, CardContent } from '../ui/Card';

interface LeaveListProps {
  leaves: any[];
  showEmployee?: boolean;
}

export const LeaveList: React.FC<LeaveListProps> = ({ leaves, showEmployee = false }) => {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
        <CalendarOff className="w-10 h-10 mb-3 text-zinc-600" />
        <h4 className="text-sm font-bold text-white">No leave records logged</h4>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">No requests matching the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {leaves.map((leave) => {
        const days = calculateDaysBetween(new Date(leave.startDate), new Date(leave.endDate)) + 1;
        const empName = leave.user?.profile?.firstName 
          ? `${leave.user.profile.firstName} ${leave.user.profile.lastName}`
          : leave.employeeName || 'Staff Member';

        return (
          <Card key={leave.id} hoverEffect className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-white/[0.06] text-white border border-white/10">
                      {leave.leaveType} LEAVE
                    </span>
                    <Badge variant={
                      leave.status === 'APPROVED' ? 'primary' :
                      leave.status === 'REJECTED' ? 'danger' : 'warning'
                    }>
                      {leave.status || 'PENDING'}
                    </Badge>
                    
                    {showEmployee && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <div className="w-5 h-5 rounded-md bg-white text-black font-bold text-[9px] flex items-center justify-center">
                          {getInitials(empName, '')}
                        </div>
                        <span className="text-xs font-bold text-white">
                          {empName}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">({leave.user?.employeeId || 'EMP'})</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-zinc-400 gap-4 pt-1 font-mono">
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                      {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {days} Day{days > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-zinc-300 mt-2 bg-black/40 p-2.5 rounded-xl border border-white/[0.08] font-mono">
                    <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-500" />
                    <p className="leading-relaxed">{leave.reason}</p>
                  </div>
                </div>

                {leave.adminRemarks && (
                  <div className="sm:w-1/3 bg-white/[0.02] p-3 rounded-xl text-xs border-l-2 border-white/40">
                    <p className="font-mono font-bold text-zinc-400 text-[10px] uppercase tracking-wider mb-1">HR Remarks:</p>
                    <p className="text-zinc-300 italic font-mono">"{leave.adminRemarks}"</p>
                    {leave.reviewer?.profile && (
                      <p className="text-[10px] text-zinc-500 mt-1.5 text-right font-mono">
                        — {leave.reviewer.profile.firstName} {leave.reviewer.profile.lastName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
