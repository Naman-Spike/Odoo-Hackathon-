import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

import EmployeeDashboard from '../pages/EmployeeDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProfilePage from '../pages/ProfilePage';
import { AttendancePage } from '../pages/AttendancePage';
import { LeavePage } from '../pages/LeavePage';
import { AdminLeavePage } from '../pages/AdminLeavePage';
import { PayrollPage } from '../pages/PayrollPage';
import { AdminPayrollPage } from '../pages/AdminPayrollPage';

const DashboardRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
};

const LeaveRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminLeavePage /> : <LeavePage />;
};

const PayrollRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminPayrollPage /> : <PayrollPage />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeaveRouter />} />
          <Route path="/payroll" element={<PayrollRouter />} />

          {/* Admin only routes */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/employees" element={<ProfilePage />} />
            <Route path="/leave/manage" element={<AdminLeavePage />} />
            <Route path="/payroll/manage" element={<AdminPayrollPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
