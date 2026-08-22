import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Clock } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatTime } from '../../lib/utils';

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
      setError(err.response?.data?.message || 'Failed to sync status');
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
      <Card className="w-full animate-pulse bg-white/70">
        <CardContent className={`p-${compact ? '4' : '6'}`}>
          <div className="h-12 bg-zinc-100 rounded-xl w-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className={`p-${compact ? '4' : '6'}`}>
        {!todayRecord ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            {!compact && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-mono mb-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ready to initiate session</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 font-sans">Shift Standby</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">Record work session</p>
              </div>
            )}
            <Button
              onClick={handleCheckIn}
              disabled={isActionLoading}
              variant="primary"
              className="w-full h-11 text-xs"
              icon={LogIn}
            >
              Initiate Shift
            </Button>
            {error && <p className="text-rose-600 text-xs font-mono">{error}</p>}
          </div>
        ) : !todayRecord.checkOut ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center w-full">
              {!compact && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Active Shift</span>
                  <Badge variant="primary">LIVE TELEMETRY</Badge>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2 text-3xl sm:text-4xl font-mono font-bold text-zinc-900 bg-zinc-50 py-4 rounded-2xl w-full border border-zinc-200 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                <span>{elapsedTime}</span>
              </div>
              {!compact && (
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  Logged in: <span className="text-zinc-900 font-semibold">{formatTime(todayRecord.checkIn)}</span>
                </p>
              )}
            </div>
            <Button
              onClick={handleCheckOut}
              disabled={isActionLoading}
              variant="outline"
              className="w-full h-11 text-xs font-bold"
              icon={LogOut}
            >
              Conclude Workday Session
            </Button>
            {error && <p className="text-rose-600 text-xs font-mono">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            {!compact && (
              <div className="w-full flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">Shift Recorded</h3>
                <Badge variant="glass">Completed</Badge>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-500">Check In</span>
                <span className="text-xs font-bold text-zinc-900 mt-0.5 font-mono">{formatTime(todayRecord.checkIn)}</span>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-500">Check Out</span>
                <span className="text-xs font-bold text-zinc-900 mt-0.5 font-mono">{formatTime(todayRecord.checkOut)}</span>
              </div>
            </div>
            {!compact && (
              <div className="w-full bg-zinc-50 text-zinc-800 p-2.5 rounded-xl text-center text-xs font-mono border border-zinc-200">
                Logged Duration: {todayRecord.totalHours?.toFixed(2) || '0.00'} Hours
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
