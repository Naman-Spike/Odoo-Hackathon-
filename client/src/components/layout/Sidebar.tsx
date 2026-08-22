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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { classNames, getInitials } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, isAdmin, logout } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', to: '/profile', icon: User },
    { name: 'Attendance', to: '/attendance', icon: Clock },
    { name: 'Leave Tracker', to: '/leave', icon: CalendarDays },
    { name: 'My Payroll', to: '/payroll', icon: Wallet },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Employee Directory', to: '/employees', icon: Users },
    { name: 'Team Attendance', to: '/attendance', icon: CheckSquare },
    { name: 'Leave Approvals', to: '/leave/manage', icon: ClipboardList },
    { name: 'Payroll Engine', to: '/payroll/manage', icon: DollarSign },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside className={classNames(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col shadow-xl border-r border-slate-800",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-glow">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Dayflow <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/50">PRO</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'HR Administration' : 'Workspace'}
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
                "flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                isActive 
                  ? "bg-indigo-600/20 text-white font-semibold border border-indigo-500/30 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
              )}
            >
              {({ isActive }) => (
                <>
                  <link.icon className={classNames(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  )} />
                  <span className="flex-1">{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-4 bg-indigo-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Online Status Pill */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-slate-300 font-medium">All systems normal</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v1.2</span>
        </div>

        {/* User Card at Bottom */}
        {user && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-indigo-400/20">
                  {getInitials(user.profile?.firstName || 'U', user.profile?.lastName || '')}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user.profile?.designation || user.email}
                </p>
              </div>
              <button 
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
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
