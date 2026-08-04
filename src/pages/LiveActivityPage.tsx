import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Activity, Play, Pause, Filter } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { formatISTDateTime } from '../utils/formatters';

export const LiveActivityPage: React.FC = () => {
  const { activities } = useCommandCenter();
  const [isPaused, setIsPaused] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const filtered = activities.filter(a => {
    if (filterCategory === 'All') return true;
    return a.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> REALTIME FIRESTORE COMMAND LOG
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            MONITOR INBOUND REGISTRATIONS, VISITOR SESSIONS AND DATABASE EVENTS (IST)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPaused
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <GlassCard variant="default" className="p-4 flex items-center gap-3 text-xs">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-400 font-bold">Filter Category:</span>
        {['All', 'Registration', 'Visitor', 'System'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              filterCategory === cat
                ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </GlassCard>

      {/* Timeline Events List */}
      <GlassCard variant="default" className="p-5 space-y-3">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-start gap-4"
          >
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{act.title}</h3>
                <span className="text-xs text-slate-500">{formatISTDateTime(act.timestamp)}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{act.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-cyan-300 border border-slate-800">
                  Category: {act.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  FIRESTORE_EVENT
                </span>
              </div>
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
};
