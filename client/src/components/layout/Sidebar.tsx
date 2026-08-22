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
  LogOut
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Liquid Glass Sidebar */}
      <aside className={classNames(
        "fixed inset-y-0 left-0 z-40 w-64 bg-black/60 backdrop-blur-2xl text-zinc-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col border-r border-white/[0.08] shadow-[10px_0_40px_rgba(0,0,0,0.6)] specular-highlight",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <Zap className="h-4 w-4 fill-black" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
                Dayflow <span className="text-[9px] font-bold text-zinc-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-mono">HRMS</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
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
                  ? "bg-white text-black font-bold shadow-[0_0_20px_-3px_rgba(255,255,255,0.35)]" 
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <link.icon className={classNames(
                    "mr-3 flex-shrink-0 h-4 w-4 transition-colors",
                    isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                  )} />
                  <span className="flex-1 tracking-tight">{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Liquid Glass Status Pill */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] text-zinc-400 font-medium">Node Sync Active</span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono">v1.2</span>
        </div>

        {/* User Card at Bottom */}
        {user && (
          <div className="p-3 border-t border-white/[0.07] bg-white/[0.01]">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs shadow-specular">
                  {getInitials(user.profile?.firstName || 'U', user.profile?.lastName || '')}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">
                  {user.profile?.designation || user.email}
                </p>
              </div>
              <button 
                onClick={logout}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
