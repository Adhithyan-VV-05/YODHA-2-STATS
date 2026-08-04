import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Activity, UserPlus, Eye, Clock, CheckCircle2 } from 'lucide-react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveActivityStream: React.FC = () => {
  const { activities } = useCommandCenter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'team_registered': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'visitor_joined': return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'session_ended': return <Clock className="w-4 h-4 text-slate-400" />;
      case 'milestone_reached': return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      default: return <Activity className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <GlassCard variant="default" className="flex flex-col h-[400px]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            LIVE ACTIVITY FEED
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
          REALTIME STREAM
        </span>
      </div>

      {/* Activity Scroll Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 font-mono">
        <AnimatePresence initial={false}>
          {activities.map((act) => {
            const timeAgo = new Date(act.timestamp).toLocaleTimeString('en-US', { hour12: false });
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
                      {act.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">{timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{act.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
