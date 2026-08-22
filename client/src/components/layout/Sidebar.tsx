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
  X,
  Sparkles
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
    <div className="flex flex-col h-full bg-gradient-to-b from-white/90 via-white/80 to-white/70 backdrop-blur-3xl border-r border-white/90 shadow-[6px_0_32px_rgba(0,0,0,0.03),inset_-1px_0_1px_rgba(255,255,255,1)] text-zinc-700 specular-highlight">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/80 bg-white/40 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.2)]">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <span className="text-base font-black text-zinc-900 tracking-tight flex items-center gap-1.5 font-sans">
              Dayflow <span className="text-[9px] font-bold text-zinc-700 bg-white/80 px-1.5 py-0.5 rounded-md border border-white/90 shadow-sm font-mono">HRMS</span>
            </span>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-white/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Label */}
      <div className="px-6 pt-5 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
          {isAdmin ? 'Corporate Suite' : 'Workspace'}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group relative select-none',
                  isActive
                    ? 'bg-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(0,0,0,0.2)] font-bold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/70 hover:backdrop-blur-md hover:border hover:border-white/80 hover:shadow-sm'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={classNames(
                    "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-black"
                  )} />
                  <span className="truncate">{link.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Card with Liquid Glass */}
      <div className="p-3 border-t border-white/80 bg-white/40 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/75 border border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
              {getInitials(user?.profile?.firstName || 'U', user?.profile?.lastName || '')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-[10px] text-zinc-400 font-mono truncate">
                {user?.employeeId} • {isAdmin ? 'HR' : 'Staff'}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={classNames(
          "fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};
