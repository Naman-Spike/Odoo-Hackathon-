import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/profile')) setPageTitle('My Profile');
    else if (path.includes('/attendance')) setPageTitle('Attendance');
    else if (path.includes('/leave/manage')) setPageTitle('Leave Approvals');
    else if (path.includes('/leave')) setPageTitle('Leave Management');
    else if (path.includes('/payroll/manage')) setPageTitle('Payroll Management');
    else if (path.includes('/payroll')) setPageTitle('Payroll');
    else if (path.includes('/employees')) setPageTitle('Employees');
    else setPageTitle('Dashboard');
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-200">
        <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
