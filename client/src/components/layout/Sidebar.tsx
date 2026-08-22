import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Zap, 
  LayoutDashboard, 
  User, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Users, 
  CheckSquare, 
  ClipboardList, 
  DollarSign,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { classNames, getInitials } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, isAdmin, logout } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Personnel Profile', to: '/profile', icon: User },
    { name: 'Attendance & Logs', to: '/attendance', icon: Clock },
    { name: 'Leave Tracker', to: '/leave', icon: CalendarDays },
    { name: 'Compensation', to: '/payroll', icon: Wallet },
  ];

  const adminLinks = [
    { name: 'Executive Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Employee Directory', to: '/employees', icon: Users },
    { name: 'Attendance Ledger', to: '/attendance', icon: CheckSquare },
    { name: 'Leave Approvals', to: '/leave/manage', icon: ClipboardList },
    { name: 'Payroll Engine', to: '/payroll/manage', icon: DollarSign },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/85 backdrop-blur-2xl border-r border-zinc-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)] text-zinc-700 specular-highlight">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 bg-white/40 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center text-white shadow-sm">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center gap-1.5 font-sans">
              Dayflow <span className="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-mono">HRMS</span>
            </span>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Label */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
          {isAdmin ? 'Administration' : 'Workspace'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => classNames(
              "flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative cursor-pointer",
              isActive 
                ? "bg-black text-white font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)]" 
                : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
            )}
          >
            {({ isActive }) => (
              <>
                <link.icon className={classNames(
                  "mr-3 flex-shrink-0 h-4 w-4 transition-colors",
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-black"
                )} />
                <span className="flex-1 tracking-tight">{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status Pill */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span className="text-[11px] text-zinc-600 font-medium">Node Sync Active</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">v1.2</span>
      </div>

      {/* User Card at Bottom */}
      {user && (
        <div className="p-3 border-t border-zinc-100 bg-white/40 flex-shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(user.profile?.firstName || 'U', user.profile?.lastName || '')}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-900 truncate">
                {user.profile?.firstName} {user.profile?.lastName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">
                {user.profile?.designation || user.email}
              </p>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-fade-in shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
