import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Calendar, FileText, User } from 'lucide-react';
import { formatDate, calculateDaysBetween } from '../../lib/utils';

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
  const initials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'U';

  return (
    <Card className="border-l-4 border-l-yellow-400">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {initials}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown Employee'}
                </h4>
                <p className="text-xs text-gray-500">
                  {leave.user?.employeeId} • {profile?.department || 'No Dept'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Badge variant="info">{leave.leaveType}</Badge>
              <span className="flex items-center text-gray-600 gap-1 font-medium">
                <Calendar className="w-4 h-4" />
                {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
              </span>
              <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                {days} Day{days > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 flex gap-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <p>{leave.reason}</p>
            </div>
          </div>

          <div className="md:w-72 flex flex-col justify-end space-y-3">
            <textarea
              className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Admin remarks (optional)..."
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isProcessing}
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                className="flex-1"
                icon={XCircle}
                onClick={() => onReject(leave.id, remarks)}
                isLoading={isProcessing}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white border-transparent"
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
