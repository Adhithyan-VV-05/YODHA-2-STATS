import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { formatISTDateTime } from '../utils/formatters';
import {
  Eye,
  Activity,
  Search,
  Trash2,
  Save
} from 'lucide-react';

export const VisitorsPage: React.FC = () => {
  const { sessions, metrics, updateTotalVisitorsCount, bulkDeleteSessions } = useCommandCenter();
  const { isAdminAuthenticated, openLoginModal } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customVisitorsCount, setCustomVisitorsCount] = useState<string>(String(metrics.totalVisits));

  // Filtered Visitor Sessions Table (Full list, time sorted)
  const filteredSessions = sessions.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.device.toLowerCase().includes(search.toLowerCase()) ||
    s.browser.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredSessions.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} session record(s)?`)) {
      await bulkDeleteSessions(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleSaveTotalVisitors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminAuthenticated) {
      openLoginModal();
      return;
    }
    const val = parseInt(customVisitorsCount, 10);
    if (!isNaN(val) && val >= 0) {
      await updateTotalVisitorsCount(val);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-700" /> Visitor Traffic & Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total website visitor logs and telemetry details
          </p>
        </div>
      </div>

      {/* TOTAL VISITORS HIGHLIGHT CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="default" className="p-6 bg-white border-slate-200 shadow-2xs md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Visitors So Far</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2 font-mono">
                {metrics.totalVisits.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Auto-updated each time the website is loaded. Stored in Firestore database.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <Eye className="w-7 h-7" />
            </div>
          </div>
        </GlassCard>

        {/* ADMIN EDIT TOTAL VISITORS WIDGET */}
        <GlassCard variant="default" className="p-5 bg-white border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase">Admin Total Visitors Edit</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Firestore Synced
            </span>
          </div>

          <form onSubmit={handleSaveTotalVisitors} className="space-y-3 mt-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Override Total Visitors Count</label>
              <input
                type="number"
                value={customVisitorsCount}
                onChange={e => setCustomVisitorsCount(e.target.value)}
                placeholder="Enter visitor count..."
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Visitor Count
            </button>
          </form>
        </GlassCard>
      </div>

      {/* VISITOR SESSIONS TABLE - FULL LIST, NO PAGINATION, S.NO TIME ORDERED */}
      <GlassCard variant="default" className="p-5 overflow-hidden bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" /> Visitor Session Telemetry ({filteredSessions.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Full time-sorted record list</p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
              </button>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search City, Browser, Device..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-slate-400 focus:bg-white outline-none w-64 font-sans"
              />
            </div>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-sans">
            No visitor session entries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredSessions.length > 0 && selectedIds.length === filteredSessions.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 w-12 text-slate-400">#</th>
                  <th className="p-3">Location / Session ID</th>
                  <th className="p-3">Device & OS</th>
                  <th className="p-3">Browser</th>
                  <th className="p-3">Resolution</th>
                  <th className="p-3">Start Time (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSessions.map((s, index) => {
                  const isSelected = selectedIds.includes(s.id);
                  return (
                    <tr key={s.id} className={`transition-colors ${isSelected ? 'bg-slate-100/70' : 'hover:bg-slate-50/80'}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(s.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{s.city}, {s.country}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.id}</div>
                      </td>
                      <td className="p-3 text-slate-800 font-medium">{s.device} ({s.os})</td>
                      <td className="p-3 text-slate-600">{s.browser}</td>
                      <td className="p-3 text-slate-500 text-[11px] font-mono">{s.screenResolution}</td>
                      <td className="p-3 text-slate-500 text-[11px] font-mono">{formatISTDateTime(s.startTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default VisitorsPage;

