import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { GlassCard } from '../components/common/GlassCard';
import { formatISTDateTime, formatDuration } from '../utils/formatters';
import { Eye, Monitor, Globe, Clock } from 'lucide-react';

export const VisitorIntelPage: React.FC = () => {
  const { sessions, metrics } = useCommandCenter();

  // Aggregate Real Device Distribution
  const deviceCounts: Record<string, number> = {};
  sessions.forEach(s => {
    deviceCounts[s.device] = (deviceCounts[s.device] || 0) + 1;
  });

  // Aggregate Real Browser Distribution
  const browserCounts: Record<string, number> = {};
  sessions.forEach(s => {
    browserCounts[s.browser] = (browserCounts[s.browser] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" /> VISITOR SESSIONS & TELEMETRY
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          LIVE USER SESSIONS LOADED DIRECTLY FROM FIRESTORE • ALL DATES/TIMES IN IST
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Visitor Sessions</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {sessions.length} Logged
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From user_sessions collection</div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Session Duration</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            {formatDuration(metrics.avgSessionDurationSeconds)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Calculated from live sessions</div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Currently Active</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {metrics.currentActiveSessions} Online
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active within past 10 minutes</div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Unique Cities</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {new Set(sessions.map(s => s.city)).size} Cities
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across India & global locations</div>
        </GlassCard>
      </div>

      {/* Device & Browser Real Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard variant="default" className="p-5">
          <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 border-b border-cyan-500/20 pb-3 mb-4">
            <Monitor className="w-4 h-4 text-cyan-400" /> Device Distribution (Real Data)
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(deviceCounts).map(([device, count]) => {
              const pct = sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : '0';
              return (
                <div key={device}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{device}</span>
                    <span className="font-bold text-cyan-400">{count} sessions ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 border-b border-cyan-500/20 pb-3 mb-4">
            <Globe className="w-4 h-4 text-emerald-400" /> Browser Distribution (Real Data)
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(browserCounts).map(([browser, count]) => {
              const pct = sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : '0';
              return (
                <div key={browser}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{browser}</span>
                    <span className="font-bold text-emerald-400">{count} sessions ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-purple-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Visitor Session Table with Duration of Each Visit in IST */}
      <GlassCard variant="default" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-cyan-500/20 bg-slate-950 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> INDIVIDUAL VISIT SESSIONS & DURATION (IST)
          </h3>
          <span className="text-[11px] text-slate-400">{sessions.length} Logged Sessions</span>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No visitor sessions recorded in Firestore `user_sessions` collection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-cyan-400 uppercase border-b border-cyan-500/20">
                <tr>
                  <th className="p-4">Session ID / Location</th>
                  <th className="p-4">Duration of Visit</th>
                  <th className="p-4">Device & OS</th>
                  <th className="p-4">Browser</th>
                  <th className="p-4">Entry Page</th>
                  <th className="p-4">Start Time (IST)</th>
                  <th className="p-4">Last Active (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/60">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${s.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        {s.city}, {s.country}
                      </div>
                      <div className="text-[10px] text-slate-500">{s.id}</div>
                    </td>
                    <td className="p-4 font-bold text-purple-400">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30">
                        {formatDuration(s.durationSeconds)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-200">{s.device} ({s.os})</td>
                    <td className="p-4 text-slate-300">{s.browser}</td>
                    <td className="p-4 text-cyan-400 font-mono">{s.entryPage}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{formatISTDateTime(s.startTime)}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{formatISTDateTime(s.lastActive)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
