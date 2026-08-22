import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle, CalendarDays, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { LeaveForm } from '../components/leave/LeaveForm';
import { LeaveList } from '../components/leave/LeaveList';

interface LeaveBalance {
  paid: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  unpaid: { total: string; used: number; remaining: string };
}

export const LeavePage = () => {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceRes, leavesRes] = await Promise.all([
        api.get('/leaves/balance'),
        api.get('/leaves/my')
      ]);
      setBalance(balanceRes.data);
      setLeaves(leavesRes.data || []);
    } catch (error) {
      console.error('Error fetching leave data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (data: any) => {
    try {
      await api.post('/leaves', data);
      setIsModalOpen(false);
      setNotification({ type: 'success', message: 'Leave application submitted successfully! Pending HR review.' });
      fetchData();
      setTimeout(() => setNotification(null), 5000);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit application');
    }
  };

  const filteredLeaves = useMemo(() => {
    if (filter === 'ALL') return leaves;
    return leaves.filter(l => l.status === filter);
  }, [leaves, filter]);

  if (loading && !balance) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400 text-sm">
        Loading leave quotas & history...
      </div>
    );
  }

  const paidUsed = balance?.paid.used ?? 0;
  const paidTotal = balance?.paid.total ?? 12;
  const paidPct = Math.min(100, Math.round((paidUsed / paidTotal) * 100));

  const sickUsed = balance?.sick.used ?? 0;
  const sickTotal = balance?.sick.total ?? 6;
  const sickPct = Math.min(100, Math.round((sickUsed / sickTotal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Leave Tracker & Quotas</h1>
          <p className="text-xs text-slate-500 mt-0.5">Apply for time off and review approval status in real-time</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="gradient" icon={PlusCircle}>
          Apply for Leave
        </Button>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Quota Progress Cards */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Paid Leave Card */}
          <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-blue-50/40 border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Paid Annual Leave</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {balance.paid.remaining} Left
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-extrabold text-slate-900">{balance.paid.remaining}</span>
                <span className="text-xs text-slate-500 font-medium">/ {balance.paid.total} total days</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-blue-50">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                <span>Used: {balance.paid.used} days</span>
                <span>{paidPct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${paidPct}%` }} />
              </div>
            </div>
          </Card>

          {/* Sick Leave Card */}
          <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-rose-50/40 border-rose-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Sick & Medical Leave</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                  {balance.sick.remaining} Left
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-extrabold text-slate-900">{balance.sick.remaining}</span>
                <span className="text-xs text-slate-500 font-medium">/ {balance.sick.total} total days</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-50">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                <span>Used: {balance.sick.used} days</span>
                <span>{sickPct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full transition-all duration-300" style={{ width: `${sickPct}%` }} />
              </div>
            </div>
          </Card>

          {/* Unpaid Leave Card */}
          <Card hoverEffect className="p-6 bg-gradient-to-br from-white to-slate-100/50 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Unpaid Leave</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                  Unlimited
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-extrabold text-slate-900">{balance.unpaid.used}</span>
                <span className="text-xs text-slate-500 font-medium">days taken this year</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Loss of pay calculations applied in payroll</span>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs and Leave List */}
      <div className="space-y-4">
        <div className="flex space-x-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200 max-w-md">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <LeaveList leaves={filteredLeaves} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave" size="md">
        <LeaveForm onSubmit={handleApply} onCancel={() => setIsModalOpen(false)} balance={balance} />
      </Modal>
    </div>
  );
};

export default LeavePage;
