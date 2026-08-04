import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Layers, HeartPulse, Leaf, Cpu, Shield, HardDrive, TrendingUp } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';

export const TracksPage: React.FC = () => {
  const { teams } = useCommandCenter();

  const total = teams.length || 1;
  const healthcare = teams.filter(t => t.track === 'Healthcare').length;
  const environment = teams.filter(t => t.track === 'Environment').length;
  const aiRobotics = teams.filter(t => t.track === 'AI & Robotics').length;
  const cybersecurity = teams.filter(t => t.track === 'Cybersecurity').length;
  const openHardware = teams.filter(t => t.track === 'Open Hardware').length;

  const tracks = [
    {
      name: 'Healthcare',
      count: healthcare,
      pct: ((healthcare / total) * 100).toFixed(1),
      icon: HeartPulse,
      color: 'text-pink-500',
      border: 'border-pink-500/40',
      bg: 'from-pink-500/10 to-slate-900',
      desc: 'Combat field medical monitoring, automated triage, biometrics & emergency response systems.'
    },
    {
      name: 'Environment',
      count: environment,
      pct: ((environment / total) * 100).toFixed(1),
      icon: Leaf,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'from-emerald-500/10 to-slate-900',
      desc: 'Tactical weather forecasting, NBC environmental hazard detection, eco-reconnaissance.'
    },
    {
      name: 'AI & Robotics',
      count: aiRobotics,
      pct: ((aiRobotics / total) * 100).toFixed(1),
      icon: Cpu,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'from-cyan-500/10 to-slate-900',
      desc: 'Autonomous drone swarms, computer vision target classification, robotic pathfinding.'
    },
    {
      name: 'Cybersecurity',
      count: cybersecurity,
      pct: ((cybersecurity / total) * 100).toFixed(1),
      icon: Shield,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'from-purple-500/10 to-slate-900',
      desc: 'Quantum-safe tactical communications, threat intelligence, air-gapped network defense.'
    },
    {
      name: 'Open Hardware',
      count: openHardware,
      pct: ((openHardware / total) * 100).toFixed(1),
      icon: HardDrive,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'from-amber-500/10 to-slate-900',
      desc: 'Custom FPGA sensor rigs, wearable HUDs, field-deployable mesh radio transceivers.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> TRACK INSIGHTS & COMPARISON
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ANALYZE PARTICIPATION SPLIT ACROSS HACKATHON MISSION TRACKS
        </p>
      </div>

      {/* Grid of Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((tr, idx) => {
          const Icon = tr.icon;
          return (
            <GlassCard key={idx} variant="glow" className={`p-5 bg-gradient-to-b ${tr.bg} ${tr.border}`}>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-950 border ${tr.border}`}>
                  <Icon className={`w-6 h-6 ${tr.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">{tr.count} Teams</div>
                  <div className={`text-xs font-bold ${tr.color}`}>{tr.pct}% Share</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-4">{tr.name}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tr.desc}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Growth Velocity</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +{15 + idx * 3}% / week
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
