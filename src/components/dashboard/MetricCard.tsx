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
  color = '#00f3ff',
  variant = 'default'
}) => {
  const isPositive = growth >= 0;

  return (
    <GlassCard variant={variant} className="flex flex-col justify-between h-40">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: `${color}12`,
              borderColor: `${color}30`,
              color
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
          </div>
        </div>

        {/* Growth % Pill */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{growth}%</span>
        </div>
      </div>

      {/* Center Animated Counter */}
      <div className="my-2 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-mono font-black text-white tracking-tight">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          <div className="text-[10px] font-mono text-slate-500">{growthLabel}</div>
        </div>

        {/* Sparkline */}
        <div className="shrink-0 pt-1">
          <Sparkline data={sparklineData} color={color} width={84} height={32} />
        </div>
      </div>
    </GlassCard>
  );
};
