import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { Sparkline } from '../common/Sparkline';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  growth: number;
  growthLabel?: string;
  sparklineData?: number[];
  icon: LucideIcon;
  color?: string;
  variant?: 'default' | 'glow' | 'amber' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  growth,
  growthLabel = 'vs last period',
  sparklineData = [12, 18, 14, 28, 22, 35, 42],
  icon: Icon,
  color: _color = '#0f172a',
  variant = 'default'
}) => {
  const isPositive = growth >= 0;

  return (
    <GlassCard variant={variant} className="flex flex-col justify-between h-36 border border-slate-200 bg-white">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-700"
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
          </div>
        </div>

        {/* Growth % Pill */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{growth}%</span>
        </div>
      </div>

      {/* Center Animated Counter */}
      <div className="my-1 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          <div className="text-[11px] font-sans text-slate-500">{growthLabel}</div>
        </div>

        {/* Sparkline */}
        <div className="shrink-0 pt-1">
          <Sparkline data={sparklineData} color="#64748b" width={84} height={32} />
        </div>
      </div>
    </GlassCard>
  );
};
