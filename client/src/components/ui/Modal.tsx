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
        className="fixed inset-0 bg-black/25 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />
      
      <div className={classNames(
        "relative w-full bg-gradient-to-br from-white/95 via-white/90 to-white/80 rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.18),inset_0_1.5px_1.5px_rgba(255,255,255,1)] p-6 sm:p-8 transition-all transform animate-slide-up border border-white/90 backdrop-blur-3xl my-8 text-zinc-900 specular-highlight",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100/80 mb-6">
          <h3 className="text-lg font-black text-zinc-900 tracking-tight font-sans">{title}</h3>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 hover:bg-white/80 focus:outline-none rounded-2xl p-1.5 transition-colors cursor-pointer border border-transparent hover:border-white/90 shadow-sm"
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
