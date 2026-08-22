import React from 'react';
import { Sparkles, Calendar, Wallet, Clock, Shield, Flame, CheckCircle2 } from 'lucide-react';

interface AIPromptSuggestionsProps {
  isAdmin: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export const AIPromptSuggestions: React.FC<AIPromptSuggestionsProps> = ({ isAdmin, onSelectPrompt }) => {
  const employeeSuggestions = [
    {
      icon: Calendar,
      label: 'Check Leave Balance',
      prompt: 'How many paid and sick leave days do I have remaining this year?'
    },
    {
      icon: Sparkles,
      label: 'Draft Sick Leave Note',
      prompt: 'Draft a formal 2-day sick leave request for recovery from viral fever.'
    },
    {
      icon: Wallet,
      label: 'Salary Slip Breakdown',
      prompt: 'Explain my monthly salary structure, deductions, and take-home pay.'
    },
    {
      icon: Clock,
      label: 'Work Hours Audit',
      prompt: 'What was my average daily shift duration and total hours worked this month?'
    }
  ];

  const adminSuggestions = [
    {
      icon: Shield,
      label: 'Executive Attendance Summary',
      prompt: 'Summarize today\'s workforce attendance turnout and punctuality rates.'
    },
    {
      icon: Calendar,
      label: 'Pending Leave Approvals',
      prompt: 'Review and summarize all pending leave requests currently in the queue.'
    },
    {
      icon: Wallet,
      label: 'Monthly Payroll Disbursal',
      prompt: 'Analyze total compensation expenditure and department salary allocation.'
    },
    {
      icon: Flame,
      label: 'Overtime & Burnout Audit',
      prompt: 'Identify any potential employee overtime hours or attendance anomalies.'
    }
  ];

  const suggestions = isAdmin ? adminSuggestions : employeeSuggestions;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
        <Sparkles className="w-3 h-3 text-black" />
        <span>Recommended Intelligence Queries</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.02)] transition-all text-left group cursor-pointer backdrop-blur-xl hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="p-1.5 rounded-xl bg-zinc-100 text-zinc-900 group-hover:bg-black group-hover:text-white transition-colors flex-shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 group-hover:text-black line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
