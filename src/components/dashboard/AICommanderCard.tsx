import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Bot, Terminal, Sparkles, RefreshCw } from 'lucide-react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { generateAICommanderBriefing } from '../../services/insightsEngine';

export const AICommanderCard: React.FC = () => {
  const { teams, metrics } = useCommandCenter();
  const [briefing, setBriefing] = useState(() => generateAICommanderBriefing(teams, metrics));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setBriefing(generateAICommanderBriefing(teams, metrics));
  }, [teams, metrics]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBriefing(generateAICommanderBriefing(teams, metrics));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <GlassCard variant="glow" className="border-indigo-500/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-2">
              AI COMMANDER <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[10px] font-mono text-indigo-300/80">
              SYNTHETIC HACKATHON INTELLIGENCE & MISSION BRIEFING
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-indigo-400 hover:text-white transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
            {briefing.timestamp}
          </span>
        </div>
      </div>

      {/* Briefing Terminal Console Output */}
      <div className="bg-slate-950/90 rounded-xl p-4 border border-indigo-500/20 font-mono text-xs text-slate-300 space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-indigo-400/80 pb-2 border-b border-slate-900">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> SYS.INTEL.REPORT // RUNTIME_v2.4
          </span>
          <span className="text-emerald-400">{briefing.statusMessage}</span>
        </div>

        <ul className="space-y-1.5 pt-1">
          {briefing.lines.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">›</span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
};
