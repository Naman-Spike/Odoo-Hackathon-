import React, { useState, useEffect } from 'react';
import { Menu, Bell, Clock, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-20 h-16 bg-white/70 backdrop-blur-3xl border-b border-white/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 specular-highlight shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Left Area: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 text-zinc-500 hover:text-black hover:bg-white/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/80 shadow-sm"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            <span>Dayflow</span>
            <span>/</span>
            <span className="text-zinc-700 font-semibold">{isAdmin ? 'Executive Suite' : 'Workspace'}</span>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-zinc-900 leading-tight tracking-tight font-sans">{title}</h1>
        </div>
      </div>

      {/* Right Area: Time, Notifications, User info */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Digital Clock Liquid Glass Chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 border border-white/90 text-zinc-800 text-xs font-mono backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.02)]">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-semibold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* User Greeting */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-zinc-600">
            {user?.profile?.firstName} <span className="font-bold text-zinc-900">{user?.profile?.lastName}</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {user?.employeeId || 'EMP'}
          </span>
        </div>

        {/* Role Badge */}
        <Badge variant={isAdmin ? 'primary' : 'glass'} className="hidden sm:inline-flex">
          {isAdmin ? 'ADMIN' : 'MEMBER'}
        </Badge>
        
        {/* Notification Bell with Glass Reflection */}
        <button className="relative p-2 text-zinc-500 hover:text-black hover:bg-white/80 rounded-2xl transition-all border border-transparent hover:border-white/90 hover:shadow-sm cursor-pointer backdrop-blur-md">
          <span className="sr-only">View notifications</span>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Profile Avatar Pill */}
        <div className="w-8 h-8 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.18)]">
          {getInitials(user?.profile?.firstName || 'U', user?.profile?.lastName || '')}
        </div>
      </div>
    </header>
  );
};
