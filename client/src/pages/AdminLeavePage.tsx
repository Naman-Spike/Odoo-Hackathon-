import React, { useEffect, useState } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import api from '../api/client';
import { LeaveList } from '../components/leave/LeaveList';
import { LeaveApprovalCard } from '../components/leave/LeaveApprovalCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

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
      setPendingLeaves(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAll = async () => {
    try {
      const res = await api.get('/leaves/all');
      setAllLeaves(res.data);
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leave Administration</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Approvals
            {pendingLeaves.length > 0 && activeTab === 'PENDING' && (
              <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                {pendingLeaves.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ALL'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Requests
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading requests...</div>
      ) : activeTab === 'PENDING' ? (
        <div className="space-y-4">
          {pendingLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
              <CheckCircle className="w-16 h-16 mb-4 text-green-400" />
              <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
              <p>No pending leave requests to review.</p>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'REJECTED', label: 'Rejected' },
                ]}
              />
            </div>
          </div>
          <LeaveList leaves={filteredAllLeaves} showEmployee={true} />
        </div>
      )}
    </div>
  );
};

export default AdminLeavePage;
