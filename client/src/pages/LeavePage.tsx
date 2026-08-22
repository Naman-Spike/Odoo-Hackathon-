import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
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
      setLeaves(leavesRes.data);
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
      setNotification({ type: 'success', message: 'Leave application submitted successfully.' });
      fetchData();
      setTimeout(() => setNotification(null), 5000);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const filteredLeaves = useMemo(() => {
    if (filter === 'ALL') return leaves;
    return leaves.filter(l => l.status === filter);
  }, [leaves, filter]);

  if (loading && !balance) return <div className="p-8 text-center">Loading leave data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Leaves</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={PlusCircle}>
          Apply for Leave
        </Button>
      </div>

      {notification && (
        <div className={`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="p-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Paid Leave</h3>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-gray-900">{balance.paid.remaining}</span>
                <span className="text-sm text-gray-500">of {balance.paid.total} total</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-red-500">
            <CardContent className="p-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Sick Leave</h3>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-gray-900">{balance.sick.remaining}</span>
                <span className="text-sm text-gray-500">of {balance.sick.total} total</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-gray-500">
            <CardContent className="p-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Unpaid Leave</h3>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-gray-900">Used: {balance.unpaid.used}</span>
                <span className="text-sm text-gray-500">Unlimited</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex space-x-1 border-b border-gray-200">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                filter === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
