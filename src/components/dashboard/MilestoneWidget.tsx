import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Trophy, Star, CheckCircle, Zap } from 'lucide-react';
import { useCommandCenter } from '../../context/CommandCenterContext';

export const MilestoneWidget: React.FC = () => {
  const { teams } = useCommandCenter();

  const milestones = [
    { title: 'First 50 Teams Registered', desc: 'Achieved in 72 hours', completed: true },
    { title: '70% Target Capacity Reached', desc: '84 / 120 Teams Active', completed: true },
    { title: '10,000 Website Visitors', desc: 'Passed on Day 4', completed: true },
    { title: '100% Target Capacity (120 Teams)', desc: 'Estimated in 24 hours', completed: false }
  ];

  const recentSpotlight = teams[0] || {
    name: 'Team Cyber-Alpha',
    leaderName: 'Aarav Sharma',
    college: 'IIT Bombay',
    track: 'Healthcare'
  };

  return (
    <GlassCard variant="default" className="flex flex-col justify-between h-[400px]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            RECENT MILESTONES & SPOTLIGHT
          </h3>
        </div>
      </div>

      {/* Spotlight Card */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 mb-3 font-mono">
        <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold uppercase mb-1">
          <Zap className="w-3.5 h-3.5" /> RECENT TEAM SPOTLIGHT
        </div>
        <div className="text-xs font-bold text-white">{recentSpotlight.name}</div>
        <div className="text-[11px] text-slate-300 mt-0.5">
          Leader: {recentSpotlight.leaderName} • {recentSpotlight.college}
        </div>
        <div className="mt-1">
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            {recentSpotlight.track}
          </span>
        </div>
      </div>

      {/* Milestones list */}
      <div className="space-y-2 font-mono text-xs flex-1 overflow-y-auto pr-1">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              m.completed
                ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.completed ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-slate-600'
              }`}
            >
              {m.completed ? <CheckCircle className="w-4 h-4" /> : <Star className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold">{m.title}</div>
              <div className="text-[10px] text-slate-400">{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
