import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick }) => {
  const { user, isAdmin } = useAuth();
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left Area: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Dayflow</span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">{isAdmin ? 'Admin Console' : 'Portal'}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        </div>
      </div>

      {/* Right Area: Time, Notifications, User info */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Digital Clock Chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* User Greeting */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-slate-500">
            {getGreeting()}, <span className="font-semibold text-slate-900">{user?.profile?.firstName || 'User'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ID: {user?.employeeId || 'EMP'}
          </span>
        </div>

        {/* Role Badge */}
        <Badge variant={isAdmin ? 'purple' : 'primary'} className="hidden sm:inline-flex">
          {isAdmin ? 'HR Administrator' : 'Staff'}
        </Badge>
        
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
        </button>

        {/* Mobile Avatar Circle */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-indigo-500/20 md:hidden">
          {getInitials(user?.profile?.firstName || 'U', user?.profile?.lastName || '')}
        </div>
      </div>
    </header>
  );
};
