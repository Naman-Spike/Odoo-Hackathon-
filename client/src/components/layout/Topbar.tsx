import React, { useState, useEffect } from 'react';
import { Menu, Bell, Clock } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-20 h-16 bg-obsidian-950/70 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 lg:px-8 specular-highlight">
      {/* Left Area: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            <span>Dayflow</span>
            <span>/</span>
            <span className="text-zinc-300 font-semibold">{isAdmin ? 'Admin Console' : 'Staff Portal'}</span>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight tracking-tight">{title}</h1>
        </div>
      </div>

      {/* Right Area: Time, Notifications, User info */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Digital Clock Chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-300 text-xs font-mono backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* User Greeting */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-zinc-300">
            {user?.profile?.firstName} <span className="font-bold text-white">{user?.profile?.lastName}</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {user?.employeeId || 'EMP'}
          </span>
        </div>

        {/* Role Badge */}
        <Badge variant={isAdmin ? 'primary' : 'glass'} className="hidden sm:inline-flex">
          {isAdmin ? 'ADMIN' : 'MEMBER'}
        </Badge>
        
        {/* Notification Bell */}
        <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
          <span className="sr-only">View notifications</span>
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-white ring-2 ring-black" />
        </button>

        {/* Mobile Avatar Circle */}
        <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs shadow-specular md:hidden">
          {getInitials(user?.profile?.firstName || 'U', user?.profile?.lastName || '')}
        </div>
      </div>
    </header>
  );
};
