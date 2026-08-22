import React, { useEffect, useState, useMemo } from 'react';
import { Search, Edit, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { formatCurrency, getInitials } from '../lib/utils';

export const AdminPayrollPage = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  
  // Edit form state
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState('');
  const [deductions, setDeductions] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payroll/all');
      setPayrolls(res.data || []);
    } catch (e) {
      console.error('Failed to fetch payrolls', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(p => {
      const name = `${p.user?.profile?.firstName || ''} ${p.user?.profile?.lastName || ''}`.toLowerCase();
      const empId = (p.user?.employeeId || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || empId.includes(term);
    });
  }, [payrolls, searchTerm]);

  const openEditModal = (payroll: any) => {
    setSelectedPayroll(payroll);
    setBasicSalary((payroll.basicSalary || 0).toString());
    setAllowances((payroll.allowances || 0).toString());
    setDeductions((payroll.deductions || 0).toString());
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put(`/payroll/${selectedPayroll.userId}`, {
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions)
      });
      setEditModalOpen(false);
      setSuccessToast('Compensation parameters updated successfully.');
      setTimeout(() => setSuccessToast(''), 4000);
      fetchPayrolls();
    } catch (e) {
      alert('Failed to update payroll.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewNetSalary = Math.max(0, Number(basicSalary || 0) + Number(allowances || 0) - Number(deductions || 0));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">Compensation Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">Configure salary bands, basic compensation, and deductions for personnel</p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-white/10 text-white border border-white/20 text-xs font-mono flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search Header */}
      <Card className="p-4 bg-white/[0.03]">
        <div className="max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            placeholder="Search by staff name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs font-mono rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-zinc-600 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-colors backdrop-blur-md"
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">Syncing payroll ledger...</div>
      ) : (
        <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-liquid backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-4 py-3.5">Staff Identity</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5 text-right">Basic Pay</th>
                <th className="px-4 py-3.5 text-right">Allowances</th>
                <th className="px-4 py-3.5 text-right">Deductions</th>
                <th className="px-4 py-3.5 text-right">Net Disbursal</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredPayrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-zinc-500 font-mono">
                    No payroll entries matching query.
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((p) => {
                  const empName = `${p.user?.profile?.firstName || 'Staff'} ${p.user?.profile?.lastName || ''}`;
                  
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white text-black font-bold text-[9px] flex items-center justify-center">
                            {getInitials(empName, '')}
                          </div>
                          <div>
                            <div className="font-bold text-white">{empName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">ID: {p.user?.employeeId || 'EMP'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">{p.user?.profile?.department || 'General'}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-300">{formatCurrency(p.basicSalary)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-300">+{formatCurrency(p.allowances)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-400">-{formatCurrency(p.deductions)}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-white">{formatCurrency(p.netSalary)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Button variant="outline" size="sm" icon={Edit} onClick={() => openEditModal(p)}>
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Salary Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Adjust Compensation Package" size="md">
        {selectedPayroll && (
          <div className="space-y-4">
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 flex items-center justify-between font-mono">
              <span className="font-bold text-xs text-white">
                {selectedPayroll.user?.profile?.firstName} {selectedPayroll.user?.profile?.lastName}
              </span>
              <span className="text-zinc-500 text-xs">
                ({selectedPayroll.user?.employeeId})
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <Input
                label="Basic Salary (₹ / Month)"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
              <Input
                label="Total Allowances (₹ / Month)"
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
              />
              <Input
                label="Standard Deductions / TDS (₹ / Month)"
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
              />
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-4 p-3 bg-black/60 rounded-xl border border-white/20 text-xs font-mono">
                <span className="font-bold text-zinc-300">Projected Net Disbursal:</span>
                <span className="text-base font-extrabold text-white">{formatCurrency(previewNetSalary)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Save Structure</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayrollPage;
