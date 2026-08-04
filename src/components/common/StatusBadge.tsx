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
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'WARNING':
      case 'PENDING':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'ALERT':
      case 'OFFLINE':
        return {
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/30',
          text: 'text-pink-400',
          dot: 'bg-pink-400'
        };
      default:
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          dot: 'bg-cyan-400'
        };
    }
  };

  const style = getColors();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border ${style.bg} ${style.border} ${style.text} ${className}`}
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
