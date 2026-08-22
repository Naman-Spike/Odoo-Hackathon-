import React, { useEffect, useState, useMemo } from 'react';
import { Search, Edit, Wallet, DollarSign, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
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
      setSuccessToast('Salary structure updated successfully.');
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
          <h1 className="text-2xl font-extrabold text-slate-900">Compensation Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure salary bands, basic compensation, and deductions for staff</p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search Header */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search employee by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading payroll ledger...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Team Member</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5 text-right">Basic Pay</th>
                <th className="px-4 py-3.5 text-right">Allowances</th>
                <th className="px-4 py-3.5 text-right">Deductions</th>
                <th className="px-4 py-3.5 text-right">Net Disbursal</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No payroll records matching your query.
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((p) => {
                  const empName = `${p.user?.profile?.firstName || 'Staff'} ${p.user?.profile?.lastName || ''}`;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                            {getInitials(empName, '')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{empName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {p.user?.employeeId || 'EMP'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{p.user?.profile?.department || 'General'}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700">{formatCurrency(p.basicSalary)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700">+{formatCurrency(p.allowances)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-rose-600">-{formatCurrency(p.deductions)}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-700">{formatCurrency(p.netSalary)}</td>
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
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Adjust Compensation Structure" size="md">
        {selectedPayroll && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {selectedPayroll.user?.profile?.firstName} {selectedPayroll.user?.profile?.lastName}
              </span>
              <span className="text-slate-500 font-mono text-xs">
                ({selectedPayroll.user?.employeeId})
              </span>
            </div>

            <div className="space-y-3">
              <Input
                label="Basic Salary (₹ / month)"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
              <Input
                label="Total Allowances (₹ / month)"
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
              />
              <Input
                label="Standard Deductions / TDS (₹ / month)"
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
              />
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900">Calculated Net In-Hand:</span>
                <span className="text-base font-extrabold text-emerald-700 font-mono">{formatCurrency(previewNetSalary)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={handleSave} isLoading={isSaving}>Save Salary Package</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayrollPage;
