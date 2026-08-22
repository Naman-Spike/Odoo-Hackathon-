import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className={classNames(
        "relative w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transition-all transform animate-slide-up border border-slate-100 my-8",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
