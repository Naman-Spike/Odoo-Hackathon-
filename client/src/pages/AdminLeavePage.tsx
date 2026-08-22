import React, { useEffect, useState } from 'react';
import { CheckCircle, Search, FileCheck, Filter, AlertCircle, Clock } from 'lucide-react';
import api from '../api/client';
import { LeaveList } from '../components/leave/LeaveList';
import { LeaveApprovalCard } from '../components/leave/LeaveApprovalCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

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
        <h1 className="text-2xl font-extrabold text-slate-900">Leave Approvals & Records</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review pending employee leave requests and audit historical records</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 max-w-md">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals</span>
          {pendingLeaves.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {pendingLeaves.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>All Leave History</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading leave queue...</div>
      ) : activeTab === 'PENDING' ? (
        <div className="space-y-4">
          {pendingLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200 text-slate-500 shadow-xs">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
              <p className="text-xs text-slate-400 max-w-sm text-center mt-1">There are no pending leave requests awaiting approval at this time.</p>
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
          <Card className="p-4 border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="Filter by staff name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
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
