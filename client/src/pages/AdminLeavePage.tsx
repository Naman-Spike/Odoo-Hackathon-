import React, { useEffect, useState } from 'react';
import { CheckCircle, Search, FileCheck, Clock } from 'lucide-react';
import api from '../api/client';
import { LeaveList } from '../components/leave/LeaveList';
import { LeaveApprovalCard } from '../components/leave/LeaveApprovalCard';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';

export const AdminLeavePage = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [allLeaves, setAllLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPending = async () => {
    try {
      const res = await api.get('/leaves/pending');
      setPendingLeaves(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAll = async () => {
    try {
      const res = await api.get('/leaves/all');
      setAllLeaves(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'PENDING') {
      fetchPending().finally(() => setLoading(false));
    } else {
      fetchAll().finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED', remarks: string) => {
    try {
      setProcessingId(id);
      await api.put(`/leaves/${id}/review`, { status, adminRemarks: remarks });
      if (activeTab === 'PENDING') await fetchPending();
      else await fetchAll();
    } catch (error) {
      console.error('Error reviewing leave', error);
      alert('Failed to update leave status.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAllLeaves = allLeaves.filter(leave => {
    const matchStatus = statusFilter === 'ALL' || leave.status === statusFilter;
    const name = `${leave.user?.profile?.firstName || ''} ${leave.user?.profile?.lastName || ''}`.toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase()) || leave.user?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-sans">Leave Approval Queue</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-medium">Audit employee leave requests and review historical applications</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 max-w-md backdrop-blur-md">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex-1 py-2 px-4 text-xs font-mono font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-white text-zinc-900 font-bold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review</span>
          {pendingLeaves.length > 0 && (
            <span className="bg-black text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {pendingLeaves.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 px-4 text-xs font-mono font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-white text-zinc-900 font-bold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>All Applications</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-400">Syncing approval queue...</div>
      ) : activeTab === 'PENDING' ? (
        <div className="space-y-4">
          {pendingLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white/80 rounded-3xl border border-zinc-200 text-zinc-400 shadow-liquid">
              <div className="h-14 w-14 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Queue Empty</h3>
              <p className="text-xs text-zinc-500 font-mono max-w-sm text-center mt-1">There are no pending leave requests awaiting approval.</p>
            </div>
          ) : (
            pendingLeaves.map(leave => (
              <LeaveApprovalCard
                key={leave.id}
                leave={leave}
                isProcessing={processingId === leave.id}
                onApprove={(id, remarks) => handleReview(id, 'APPROVED', remarks)}
                onReject={(id, remarks) => handleReview(id, 'REJECTED', remarks)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 bg-white/80">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  placeholder="Filter by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-xs font-mono rounded-xl border border-zinc-200 bg-white/90 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors backdrop-blur-md"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: 'PENDING', label: 'Pending Review' },
                    { value: 'APPROVED', label: 'Approved' },
                    { value: 'REJECTED', label: 'Rejected' },
                  ]}
                />
              </div>
            </div>
          </Card>
          <LeaveList leaves={filteredAllLeaves} showEmployee={true} />
        </div>
      )}
    </div>
  );
};

export default AdminLeavePage;
