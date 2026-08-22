import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle, Clock, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { LeaveForm } from '../components/leave/LeaveForm';
import { LeaveList } from '../components/leave/LeaveList';

interface LeaveBalance {
  paid: { total: number; used: number; remaining: number; balance?: number };
  sick: { total: number; used: number; remaining: number; balance?: number };
  unpaid: { total: string; used: number; remaining: string; balance?: number | null };
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
      setNotification({ type: 'success', message: 'Leave request recorded and submitted to HR queue.' });
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
      <div className="flex h-[60vh] items-center justify-center text-zinc-400 text-xs font-mono">
        Loading quota telemetry...
      </div>
    );
  }

  const paidUsed = balance?.paid.used ?? 0;
  const paidTotal = balance?.paid.total ?? 12;
  const paidRemaining = balance?.paid?.remaining ?? balance?.paid?.balance ?? Math.max(0, paidTotal - paidUsed);
  const paidPct = Math.min(100, Math.round((paidUsed / paidTotal) * 100));

  const sickUsed = balance?.sick.used ?? 0;
  const sickTotal = balance?.sick.total ?? 6;
  const sickRemaining = balance?.sick?.remaining ?? balance?.sick?.balance ?? Math.max(0, sickTotal - sickUsed);
  const sickPct = Math.min(100, Math.round((sickUsed / sickTotal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Leave Management & Quotas</h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-medium">Audit annual entitlements and submit time off requests</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={PlusCircle}>
          Apply for Leave
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-mono flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Quota Progress Cards */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Paid Leave Card */}
          <Card hoverEffect className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Paid Annual Quota</span>
                <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  {paidRemaining} Available
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3 font-mono">
                <span className="text-3xl font-extrabold text-zinc-900">{paidRemaining}</span>
                <span className="text-xs text-zinc-500">/ {balance.paid.total} total</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                <span>Used: {balance.paid.used} days</span>
                <span className="font-bold text-zinc-900">{paidPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${paidPct}%` }} />
              </div>
            </div>
          </Card>

          {/* Sick Leave Card */}
          <Card hoverEffect className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Medical & Sick Leave</span>
                <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  {sickRemaining} Available
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3 font-mono">
                <span className="text-3xl font-extrabold text-zinc-900">{sickRemaining}</span>
                <span className="text-xs text-zinc-500">/ {balance.sick.total} total</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                <span>Used: {balance.sick.used} days</span>
                <span className="font-bold text-zinc-900">{sickPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-700 rounded-full transition-all duration-300" style={{ width: `${sickPct}%` }} />
              </div>
            </div>
          </Card>

          {/* Unpaid Leave Card */}
          <Card hoverEffect className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Unpaid Leave</span>
                <span className="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  Unlimited
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3 font-mono">
                <span className="text-3xl font-extrabold text-zinc-900">{balance.unpaid.used}</span>
                <span className="text-xs text-zinc-500">days logged this year</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100">
              <div className="text-[10px] font-mono text-zinc-400">
                Discretionary unpaid time-off subject to manager review
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filter Tabs & History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 font-mono uppercase tracking-wider">Leave Applications History</h2>
          
          <div className="flex space-x-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-mono">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filter === f ? 'bg-black text-white font-bold shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <LeaveList leaves={filteredLeaves} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Leave Request" size="md">
        <LeaveForm onSubmit={handleApply} onCancel={() => setIsModalOpen(false)} balance={balance} />
      </Modal>
    </div>
  );
};

export default LeavePage;
