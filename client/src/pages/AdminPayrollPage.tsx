import React, { useEffect, useState, useMemo } from 'react';
import { Search, Edit } from 'lucide-react';
import api from '../api/client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { formatCurrency } from '../lib/utils';

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

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payroll/all');
      setPayrolls(res.data);
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
    setBasicSalary(payroll.basicSalary.toString());
    setAllowances(payroll.allowances.toString());
    setDeductions(payroll.deductions.toString());
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
      fetchPayrolls();
    } catch (e) {
      alert('Failed to update payroll.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewNetSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Administration</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="max-w-md">
          <Input
            icon={Search}
            placeholder="Search employee by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading payroll data...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No payroll records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayrolls.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {p.user?.profile?.firstName} {p.user?.profile?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{p.user?.employeeId}</div>
                    </TableCell>
                    <TableCell>{p.user?.profile?.department || 'N/A'}</TableCell>
                    <TableCell className="text-right font-medium text-gray-600">{formatCurrency(p.basicSalary)}</TableCell>
                    <TableCell className="text-right text-gray-600">{formatCurrency(p.allowances)}</TableCell>
                    <TableCell className="text-right text-red-600">{formatCurrency(p.deductions)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{formatCurrency(p.netSalary)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEditModal(p)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Payroll Details">
        {selectedPayroll && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
              <span className="font-medium text-gray-900">{selectedPayroll.user?.profile?.firstName} {selectedPayroll.user?.profile?.lastName}</span>
              <span className="text-gray-500 text-sm ml-2">({selectedPayroll.user?.employeeId})</span>
            </div>

            <div className="space-y-4">
              <Input
                label="Basic Salary"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
              <Input
                label="Allowances"
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
              />
              <Input
                label="Deductions"
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
              />
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-md">
                <span className="font-semibold text-blue-900">Calculated Net Salary:</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(previewNetSalary)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayrollPage;
