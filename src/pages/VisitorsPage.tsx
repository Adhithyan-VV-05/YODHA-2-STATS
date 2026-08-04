import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { GlassCard } from '../components/common/GlassCard';
import { formatISTDateTime, formatDuration } from '../utils/formatters';
import {
  Eye,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  Activity,
  Cpu,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const VisitorsPage: React.FC = () => {
  const { sessions, metrics } = useCommandCenter();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Compute Visitor Analytics
  const totalSessions = sessions.length;
  const liveSessions = sessions.filter(s => s.isOnline).length;

  const durations = sessions.map(s => s.durationSeconds || 0);
  const longestSession = durations.length > 0 ? Math.max(...durations) : 0;
  const shortestSession = durations.length > 0 ? Math.min(...durations) : 0;

  const desktopSessions = sessions.filter(s => s.device === 'Desktop' || s.device === 'Laptop').length;
  const mobileSessions = sessions.filter(s => s.device === 'Mobile' || s.device === 'Tablet').length;

  const desktopPct = totalSessions > 0 ? Number(((desktopSessions / totalSessions) * 100).toFixed(1)) : 0;
  const mobilePct = totalSessions > 0 ? Number(((mobileSessions / totalSessions) * 100).toFixed(1)) : 0;

  // Device Counts
  const deviceCounts: Record<string, number> = {};
  sessions.forEach(s => { deviceCounts[s.device] = (deviceCounts[s.device] || 0) + 1; });

  // Browser Counts
  const browserCounts: Record<string, number> = {};
  sessions.forEach(s => { browserCounts[s.browser] = (browserCounts[s.browser] || 0) + 1; });

  const browserData = Object.entries(browserCounts).map(([name, value], idx) => ({
    name,
    value,
    color: ['#00f3ff', '#00ff9d', '#ffaa00', '#9d4edd', '#ff0055'][idx % 5]
  }));

  // OS Counts
  const osCounts: Record<string, number> = {};
  sessions.forEach(s => { osCounts[s.os] = (osCounts[s.os] || 0) + 1; });

  const osData = Object.entries(osCounts).map(([name, value], idx) => ({
    name,
    value,
    color: ['#00f3ff', '#00ff9d', '#9d4edd', '#ffaa00', '#ff0055'][idx % 5]
  }));

  // Filtered & Paginated Visitor Sessions Table
  const filteredSessions = sessions.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.device.toLowerCase().includes(search.toLowerCase()) ||
    s.browser.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1;
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getTabBadge = (tabStatus: string) => {
    switch (tabStatus) {
      case 'Focused':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">🔵 Focused</span>;
      case 'Online':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">🟢 Online</span>;
      case 'Background':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/40">🟡 Background</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">🔴 Offline</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* HEADER */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" /> VISITOR ANALYTICS & TELEMETRY
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          REAL-TIME TELEMETRY BASED EXCLUSIVELY ON FIRESTORE <code className="text-cyan-400">user_sessions</code> COLLECTION
        </p>
      </div>

      {/* VISITOR ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="glow" className="p-4 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</div>
          <div className="text-2xl font-black text-white mt-1">{totalSessions} Logged</div>
          <div className="text-[11px] text-slate-400 mt-1 font-bold text-cyan-400">
            🟢 Live Sessions: {liveSessions}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Active Time</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            {formatDuration(metrics.avgActiveTimeSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg Inactive Time: {formatDuration(metrics.avgInactiveTimeSeconds)}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Session Duration Bounds</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {formatDuration(longestSession)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Shortest Session: {formatDuration(shortestSession)}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Device Ratio</div>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" /> {desktopPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Mobile / Tablet: {mobilePct}%
          </div>
        </GlassCard>
      </div>

      {/* SIMPLE CHARTS: BROWSER & OS DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browser Distribution Donut Chart */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[320px]">
          <div className="border-b border-cyan-500/20 pb-3 mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Browser Distribution
            </h3>
            <span className="text-[10px] text-slate-400">FIRESTORE SESSIONS</span>
          </div>

          {browserData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              No browser sessions recorded.
            </div>
          ) : (
            <div className="w-full h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={browserData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#00f3ff', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Operating System Distribution Bar Chart */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[320px]">
          <div className="border-b border-cyan-500/20 pb-3 mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> Operating System Distribution
            </h3>
            <span className="text-[10px] text-slate-400">FIRESTORE SESSIONS</span>
          </div>

          {osData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              No OS telemetry recorded.
            </div>
          ) : (
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={osData}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#00ff9d', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="value" fill="#00ff9d" radius={[6, 6, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* VISITOR SESSIONS TABLE */}
      <GlassCard variant="default" className="p-5 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> VISITOR SESSIONS TABLE ({filteredSessions.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">EXACT TELEMETRY FROM FIRESTORE user_sessions COLLECTION</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search Session ID, City, Device, Browser..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none w-64 font-mono"
            />
          </div>
        </div>

        {paginatedSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No visitor session entries found in Firestore.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-cyan-400 uppercase border-b border-cyan-500/20">
                <tr>
                  <th className="p-3">Session / Location</th>
                  <th className="p-3">Device & OS</th>
                  <th className="p-3">Browser</th>
                  <th className="p-3">Resolution</th>
                  <th className="p-3">Start Time (IST)</th>
                  <th className="p-3">End Time (IST)</th>
                  <th className="p-3">Active Time</th>
                  <th className="p-3">Inactive Time</th>
                  <th className="p-3">Online Status</th>
                  <th className="p-3">Tab Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {paginatedSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{s.city}, {s.country}</div>
                      <div className="text-[10px] text-slate-500">{s.id}</div>
                    </td>
                    <td className="p-3 text-slate-200">{s.device} ({s.os})</td>
                    <td className="p-3 text-slate-300">{s.browser}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{s.screenResolution}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{formatISTDateTime(s.startTime)}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{s.endTime ? formatISTDateTime(s.endTime) : 'Active Now'}</td>
                    <td className="p-3 font-bold text-emerald-400">{formatDuration(s.activeTimeSeconds)}</td>
                    <td className="p-3 text-amber-400">{formatDuration(s.inactiveTimeSeconds)}</td>
                    <td className="p-3">
                      {s.isOnline ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">🟢 Online</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-500 border border-slate-800">🔴 Offline</span>
                      )}
                    </td>
                    <td className="p-3">{getTabBadge(s.tabStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
