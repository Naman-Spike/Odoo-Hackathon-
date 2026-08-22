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
    <div className="min-h-screen bg-[#fafbfc] text-zinc-900 flex selection:bg-black selection:text-white relative overflow-x-hidden">
      {/* Dynamic Liquid Glass Iridescent Diffuser Mesh */}
      <div className="fixed top-0 left-1/4 w-[750px] h-[450px] bg-gradient-to-tr from-sky-100/50 via-indigo-100/40 to-transparent blur-[140px] rounded-full pointer-events-none -translate-y-1/3 animate-liquid-float z-0" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[500px] bg-gradient-to-bl from-teal-50/50 via-slate-100/60 to-transparent blur-[160px] rounded-full pointer-events-none translate-y-1/4 animate-liquid-pulse z-0" />
      <div className="fixed top-1/2 left-2/3 w-[450px] h-[350px] bg-purple-50/40 blur-[130px] rounded-full pointer-events-none z-0" />
      
      {/* Fixed/Sticky Liquid Glass Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
