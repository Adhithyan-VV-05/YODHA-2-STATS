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

  // Browser Counts
  const browserCounts: Record<string, number> = {};
  sessions.forEach(s => { browserCounts[s.browser] = (browserCounts[s.browser] || 0) + 1; });

  const browserData = Object.entries(browserCounts).map(([name, value], idx) => ({
    name,
    value,
    color: ['#0f172a', '#475569', '#64748b', '#94a3b8', '#cbd5e1'][idx % 5]
  }));

  // OS Counts
  const osCounts: Record<string, number> = {};
  sessions.forEach(s => { osCounts[s.os] = (osCounts[s.os] || 0) + 1; });

  const osData = Object.entries(osCounts).map(([name, value], idx) => ({
    name,
    value,
    color: ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'][idx % 5]
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
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">Focused</span>;
      case 'Online':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Online</span>;
      case 'Background':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Background</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">Offline</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-700" /> Visitor Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time user session telemetry and browser analytics
        </p>
      </div>

      {/* VISITOR ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-4 flex flex-col justify-between bg-white border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Sessions</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalSessions} Logged</div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">
            Live Sessions: <strong className="text-emerald-600">{liveSessions}</strong>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between bg-white border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Active Time</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-slate-500" />
            {formatDuration(metrics.avgActiveTimeSeconds)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg Inactive: {formatDuration(metrics.avgInactiveTimeSeconds)}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between bg-white border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Session Duration Bounds</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatDuration(longestSession)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Shortest: {formatDuration(shortestSession)}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex flex-col justify-between bg-white border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Device Ratio</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-slate-500" /> {desktopPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Mobile / Tablet: {mobilePct}%
          </div>
        </GlassCard>
      </div>

      {/* SIMPLE CHARTS: BROWSER & OS DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browser Distribution Donut Chart */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[320px] bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-700" /> Browser Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">FIRESTORE SESSIONS</span>
          </div>

          {browserData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
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
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Operating System Distribution Bar Chart */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[320px] bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" /> Operating System Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">FIRESTORE SESSIONS</span>
          </div>

          {osData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              No OS telemetry recorded.
            </div>
          ) : (
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={osData}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* VISITOR SESSIONS TABLE */}
      <GlassCard variant="default" className="p-5 overflow-hidden bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" /> Visitor Sessions Table ({filteredSessions.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Exact session telemetry from Firestore user_sessions collection</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search Session ID, City, Device, Browser..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-slate-400 focus:bg-white outline-none w-64 font-sans"
            />
          </div>
        </div>

        {paginatedSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-sans">
            No visitor session entries found in Firestore.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Location / Session</th>
                  <th className="p-3">Device & OS</th>
                  <th className="p-3">Browser</th>
                  <th className="p-3">Resolution</th>
                  <th className="p-3">Start Time (IST)</th>
                  <th className="p-3">Active Time</th>
                  <th className="p-3">Inactive Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{s.city}, {s.country}</div>
                      <div className="text-[11px] text-slate-400">{s.id}</div>
                    </td>
                    <td className="p-3 text-slate-800 font-medium">{s.device} ({s.os})</td>
                    <td className="p-3 text-slate-600">{s.browser}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{s.screenResolution}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{formatISTDateTime(s.startTime)}</td>
                    <td className="p-3 font-semibold text-emerald-700">{formatDuration(s.activeTimeSeconds)}</td>
                    <td className="p-3 text-slate-600">{formatDuration(s.inactiveTimeSeconds)}</td>
                    <td className="p-3">
                      {s.isOnline ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Online</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">Offline</span>
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
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
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
