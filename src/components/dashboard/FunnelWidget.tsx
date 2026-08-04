import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Filter, ArrowDown } from 'lucide-react';

export const FunnelWidget: React.FC = () => {
  const steps = [
    { label: 'Total Visitors', count: 14280, pct: '100%', color: 'from-cyan-500 to-blue-500' },
    { label: 'Inspected /tracks', count: 8940, pct: '62.6%', color: 'from-blue-500 to-indigo-500' },
    { label: 'Initiated Registration', count: 2450, pct: '17.1%', color: 'from-indigo-500 to-purple-500' },
    { label: 'Completed Team Submission', count: 84, pct: '8.6%', color: 'from-purple-500 to-emerald-400' }
  ];

  return (
    <GlassCard variant="default" className="flex flex-col justify-between h-[400px]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            VISITOR-TO-REGISTRATION FUNNEL
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
          CONVERSION: 8.6%
        </span>
      </div>

      <div className="space-y-3 font-mono flex-1 flex flex-col justify-center">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-bold">{step.label}</span>
              <span className="text-cyan-400 font-mono font-bold">{step.count.toLocaleString()} ({step.pct})</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${step.color} transition-all duration-1000`}
                style={{ width: step.pct }}
              />
            </div>
            {idx < steps.length - 1 && (
              <div className="flex justify-center my-1 text-slate-600">
                <ArrowDown className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
