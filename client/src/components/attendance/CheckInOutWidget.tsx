import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Clock } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { formatTime, getStatusColor } from '../../lib/utils';

interface CheckInOutWidgetProps {
  compact?: boolean;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  workDate: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
}

export const CheckInOutWidget: React.FC<CheckInOutWidgetProps> = ({ compact = false }) => {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodayRecord();
  }, []);

  useEffect(() => {
    let interval: any;
    if (todayRecord && !todayRecord.checkOut && todayRecord.checkIn) {
      interval = setInterval(() => {
        const start = new Date(todayRecord.checkIn).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, now - start);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todayRecord]);

  const fetchTodayRecord = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get('/attendance/today');
      setTodayRecord(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setIsActionLoading(true);
      setError(null);
      const { data } = await api.post('/attendance/check-in');
      setTodayRecord(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsActionLoading(true);
      setError(null);
      const { data } = await api.post('/attendance/check-out');
      setTodayRecord(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse bg-gray-50 border-gray-100">
        <CardContent className={`p-${compact ? '4' : '6'}`}>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    if (!todayRecord) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          {!compact && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">Ready to start?</h3>
              <p className="text-sm text-gray-500 mt-1">Start your workday by checking in</p>
            </div>
          )}
          <Button
            onClick={handleCheckIn}
            disabled={isActionLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 h-12"
          >
            <LogIn className="w-5 h-5" />
            <span>Check In</span>
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );
    }

    if (!todayRecord.checkOut) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center w-full">
            {!compact && <h3 className="text-lg font-medium text-gray-700 mb-2">Checked In</h3>}
            <div className="flex items-center justify-center space-x-2 text-2xl font-mono text-gray-800 bg-gray-100 py-3 rounded-lg w-full border border-gray-200 shadow-inner">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{elapsedTime}</span>
            </div>
            {!compact && (
              <p className="text-sm text-gray-500 mt-3">
                Since {formatTime(todayRecord.checkIn)}
              </p>
            )}
          </div>
          <Button
            onClick={handleCheckOut}
            disabled={isActionLoading}
            variant="danger"
            className="w-full flex items-center justify-center gap-2 h-12"
          >
            <LogOut className="w-5 h-5" />
            <span>Check Out</span>
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        {!compact && (
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Workday Complete</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(todayRecord.status)}`}>
              {todayRecord.status.replace('_', ' ')}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Check In</span>
            <span className="text-sm font-medium">{formatTime(todayRecord.checkIn)}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Check Out</span>
            <span className="text-sm font-medium">{formatTime(todayRecord.checkOut)}</span>
          </div>
        </div>
        {!compact && (
          <div className="w-full bg-blue-50 text-blue-800 p-3 rounded-lg text-center font-medium mt-2">
            Total Hours: {todayRecord.totalHours?.toFixed(1) || '0.0'} hrs
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`w-full overflow-hidden transition-all duration-300 ${!todayRecord ? 'bg-white' : todayRecord.checkOut ? 'bg-gray-50/50' : 'bg-green-50/30'}`}>
      <CardContent className={`p-${compact ? '4' : '6'}`}>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
