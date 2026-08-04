import React from 'react';

interface StatusBadgeProps {
  status: 'ONLINE' | 'OFFLINE' | 'SYNCED' | 'WARNING' | 'ALERT' | 'VERIFIED' | 'PENDING';
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulse = true, className = '' }) => {
  const getColors = () => {
    switch (status) {
      case 'ONLINE':
      case 'SYNCED':
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500'
        };
      case 'WARNING':
      case 'PENDING':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          dot: 'bg-amber-500'
        };
      case 'ALERT':
      case 'OFFLINE':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-100',
          border: 'border-slate-200',
          text: 'text-slate-700',
          dot: 'bg-slate-500'
        };
    }
  };

  const style = getColors();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-wide border ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
      </span>
      {status}
    </span>
  );
};
