import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Clock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
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
      <Card className="w-full animate-pulse bg-slate-50 border-slate-200">
        <CardContent className={`p-${compact ? '4' : '6'}`}>
          <div className="h-14 bg-slate-200 rounded-xl w-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full overflow-hidden transition-all duration-300 border-slate-200 ${
      todayRecord?.checkIn && !todayRecord.checkOut 
        ? 'bg-gradient-to-br from-emerald-500/5 via-white to-indigo-500/5 ring-1 ring-emerald-500/30' 
        : 'bg-white'
    }`}>
      <CardContent className={`p-${compact ? '4' : '6'}`}>
        {!todayRecord ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            {!compact && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ready to start work?</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Clock In for Today</h3>
                <p className="text-xs text-slate-500 mt-0.5">Start your official workday session</p>
              </div>
            )}
            <Button
              onClick={handleCheckIn}
              disabled={isActionLoading}
              variant="success"
              className="w-full h-12 text-sm shadow-glow-success"
              icon={LogIn}
            >
              Check In Now
            </Button>
            {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
          </div>
        ) : !todayRecord.checkOut ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center w-full">
              {!compact && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Shift</span>
                  <Badge variant="success">Live Session</Badge>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2 text-3xl sm:text-4xl font-mono font-bold text-slate-900 bg-slate-50 py-4 rounded-2xl w-full border border-slate-200 shadow-inner">
                <Clock className="w-6 h-6 text-emerald-500 animate-pulse" />
                <span>{elapsedTime}</span>
              </div>
              {!compact && (
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Logged in at <span className="text-slate-900 font-semibold">{formatTime(todayRecord.checkIn)}</span>
                </p>
              )}
            </div>
            <Button
              onClick={handleCheckOut}
              disabled={isActionLoading}
              variant="danger"
              className="w-full h-12 text-sm shadow-glow-danger"
              icon={LogOut}
            >
              Complete Shift & Check Out
            </Button>
            {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            {!compact && (
              <div className="w-full flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-slate-900">Workday Logged</h3>
                <Badge variant="info">Completed</Badge>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Check In</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5">{formatTime(todayRecord.checkIn)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Check Out</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5">{formatTime(todayRecord.checkOut)}</span>
              </div>
            </div>
            {!compact && (
              <div className="w-full bg-indigo-50 text-indigo-900 p-3 rounded-xl text-center text-xs font-bold border border-indigo-100">
                Total Worked: {todayRecord.totalHours?.toFixed(2) || '0.00'} Hours
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
