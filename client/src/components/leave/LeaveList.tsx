import React from 'react';
import { CalendarOff, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, calculateDaysBetween } from '../../lib/utils';
import { Card, CardContent } from '../ui/Card';

interface LeaveListProps {
  leaves: any[];
  showEmployee?: boolean;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'danger';
    case 'PENDING': return 'warning';
    default: return 'default';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'PAID': return 'bg-blue-100 text-blue-800';
    case 'SICK': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const LeaveList: React.FC<LeaveListProps> = ({ leaves, showEmployee = false }) => {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <CalendarOff className="w-12 h-12 mb-2 text-gray-400" />
        <p>No leave requests found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leaves.map((leave) => {
        const days = calculateDaysBetween(new Date(leave.startDate), new Date(leave.endDate)) + 1;
        
        return (
          <Card key={leave.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(leave.leaveType)}`}>
                      {leave.leaveType}
                    </span>
                    <Badge variant={getStatusVariant(leave.status)}>{leave.status}</Badge>
                    {showEmployee && leave.user?.profile && (
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {leave.user.profile.firstName} {leave.user.profile.lastName} ({leave.user.employeeId})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </div>
                    <div className="flex items-center gap-1 font-medium text-gray-700">
                      <Clock className="w-4 h-4" />
                      {days} Day{days > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-md">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{leave.reason}</p>
                  </div>
                </div>

                {leave.adminRemarks && (
                  <div className="sm:w-1/3 bg-gray-50 p-3 rounded-md text-sm border-l-2 border-gray-300">
                    <p className="font-semibold text-gray-700 text-xs mb-1">Admin Remarks:</p>
                    <p className="text-gray-600 italic">"{leave.adminRemarks}"</p>
                    {leave.reviewer?.profile && (
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        - {leave.reviewer.profile.firstName} {leave.reviewer.profile.lastName}
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
