import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Bell } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';

export const NotificationsPage: React.FC = () => {
  const { activities } = useCommandCenter();

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" /> OPERATIONAL ALERT HISTORY
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          REAL-TIME TOAST HISTORY AND SYSTEM LOG NOTIFICATIONS
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {activities.map((act) => (
          <GlassCard key={act.id} variant="default" className="p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{act.title}</h3>
                <span className="text-xs text-slate-500">{new Date(act.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{act.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
