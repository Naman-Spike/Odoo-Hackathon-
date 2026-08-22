import React from 'react';
import { CalendarOff, Clock, Calendar as CalendarIcon, FileText, User } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
        <CalendarOff className="w-12 h-12 mb-3 text-slate-300" />
        <h4 className="text-sm font-bold text-slate-800">No leave records found</h4>
        <p className="text-xs text-slate-500 mt-0.5">No requests matching your current filter.</p>
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
          <Card key={leave.id} hoverEffect className="overflow-hidden border-slate-200 shadow-2xs">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {leave.leaveType} LEAVE
                    </span>
                    <Badge variant={
                      leave.status === 'APPROVED' ? 'success' :
                      leave.status === 'REJECTED' ? 'danger' : 'warning'
                    }>
                      {leave.status || 'PENDING'}
                    </Badge>
                    
                    {showEmployee && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <div className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                          {getInitials(empName, '')}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {empName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({leave.user?.employeeId || 'EMP'})</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-600 gap-4 pt-1">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                      {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {days} Day{days > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <p className="leading-relaxed">{leave.reason}</p>
                  </div>
                </div>

                {leave.adminRemarks && (
                  <div className="sm:w-1/3 bg-slate-50 p-3 rounded-xl text-xs border-l-2 border-indigo-500">
                    <p className="font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-1">Admin Feedback:</p>
                    <p className="text-slate-600 italic">"{leave.adminRemarks}"</p>
                    {leave.reviewer?.profile && (
                      <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
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
