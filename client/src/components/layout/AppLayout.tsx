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
    if (path.includes('/profile')) setPageTitle('Personnel Profile');
    else if (path.includes('/attendance')) setPageTitle('Timecard & Attendance');
    else if (path.includes('/leave/manage')) setPageTitle('Leave Approvals');
    else if (path.includes('/leave')) setPageTitle('Leave Tracker');
    else if (path.includes('/payroll/manage')) setPageTitle('Compensation Ledger');
    else if (path.includes('/payroll')) setPageTitle('Payroll & Payslips');
    else if (path.includes('/employees')) setPageTitle('Employee Directory');
    else setPageTitle('Dashboard');
  }, [location]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-zinc-900 relative overflow-x-hidden selection:bg-black selection:text-white">
      {/* Light Crystal Ambient Glow Elements */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-blue-50/40 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-zinc-100/60 blur-[160px] rounded-full pointer-events-none translate-y-1/3" />
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-200 relative z-10">
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
