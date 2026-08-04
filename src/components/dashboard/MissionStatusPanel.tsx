import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { Shield, Target, Clock, AlertTriangle } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface MissionStatusPanelProps {
  registeredTeamsCount?: number;
  maxTeamsCapacity?: number;
}

export const MissionStatusPanel: React.FC<MissionStatusPanelProps> = ({
  registeredTeamsCount = 84,
  maxTeamsCapacity = 120
}) => {
  const percentage = Math.round((registeredTeamsCount / maxTeamsCapacity) * 100);
  const remainingCapacity = maxTeamsCapacity - registeredTeamsCount;

  // Real-time countdown to registration closing (e.g., 2 days 14 hours 22 minutes 45 seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 35, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SVG Progress Ring Calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <GlassCard variant="glow" className="relative overflow-hidden border-cyan-500/30">
      {/* Background Cyber Scanning Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-glow shadow-cyan-500/10">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-extrabold text-white tracking-widest uppercase">
              MISSION STATUS
            </h2>
            <p className="text-[11px] font-mono text-cyan-400/80">
              YODHA 2026 HACKATHON LIVE OPERATIONAL METRICS
            </p>
          </div>
        </div>

        <StatusBadge status="ONLINE" pulse={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Progress Ring */}
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Outer Background Ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Ring Gradient */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-mono font-black text-white">
                <AnimatedCounter value={percentage} suffix="%" />
              </span>
              <span className="text-[9px] font-mono uppercase text-cyan-400 tracking-wider">Target Achieved</span>
            </div>
          </div>

          <div className="font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Mission Progress</div>
            <div className="text-xl font-bold text-white mt-1">
              <span className="text-cyan-400">{registeredTeamsCount}</span>
              <span className="text-slate-500"> / {maxTeamsCapacity} Teams</span>
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Capacity Remaining: {remainingCapacity} Teams
            </div>
          </div>
        </div>

        {/* Center: Live Registration Countdown */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-cyan-500/20 flex flex-col items-center justify-center text-center font-mono">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase mb-2">
            <Clock className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
            REGISTRATION CLOSING COUNTDOWN
          </div>
          <div className="flex items-center gap-3 text-xl font-bold text-white tracking-widest">
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="block text-[9px] text-slate-500 font-normal">HOURS</span>
            </div>
            <span className="text-cyan-400 animate-pulse">:</span>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="block text-[9px] text-slate-500 font-normal">MINS</span>
            </div>
            <span className="text-cyan-400 animate-pulse">:</span>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-400">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="block text-[9px] text-slate-500 font-normal">SECS</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats Breakdown */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">Visitors Online</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> 17 Active
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">Database Latency</span>
            <span className="font-bold text-cyan-300">14 ms (Optimal)</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">Capacity Status</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> 70% Filled
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
