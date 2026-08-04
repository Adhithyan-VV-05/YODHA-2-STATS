import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useCommandCenter } from '../context/CommandCenterContext';
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
import { LineChart as LineChartIcon, PieChart as PieIcon, BarChart3, GraduationCap, Layers, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { teams, collegeStats } = useCommandCenter();

  // Track Data Calculation
  const healthcareCount = teams.filter(t => t.track === 'Healthcare').length;
  const environmentCount = teams.filter(t => t.track === 'Environment').length;
  const aiCount = teams.filter(t => t.track === 'AI & Robotics').length;
  const cyberCount = teams.filter(t => t.track === 'Cybersecurity').length;
  const openHardwareCount = teams.filter(t => t.track === 'Open Hardware').length;

  const total = teams.length || 1;

  const trackData = [
    { name: 'Healthcare', count: healthcareCount, pct: Number(((healthcareCount / total) * 100).toFixed(1)), color: '#0f172a' },
    { name: 'Environment', count: environmentCount, pct: Number(((environmentCount / total) * 100).toFixed(1)), color: '#334155' },
    { name: 'AI & Robotics', count: aiCount, pct: Number(((aiCount / total) * 100).toFixed(1)), color: '#475569' },
    { name: 'Cybersecurity', count: cyberCount, pct: Number(((cyberCount / total) * 100).toFixed(1)), color: '#64748b' },
    { name: 'Open Hardware', count: openHardwareCount, pct: Number(((openHardwareCount / total) * 100).toFixed(1)), color: '#94a3b8' }
  ];

  const collegePieData = collegeStats.slice(0, 5).map((col, idx) => ({
    name: col.collegeName,
    value: col.totalParticipants,
    color: ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'][idx % 5]
  }));

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-slate-700" /> Hackathon Track & College Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time analytics based on team registrations and college participant data
        </p>
      </div>

      {/* TRACK ANALYTICS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Track Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Track Pie Chart */}
          <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[360px] bg-white border-slate-200 shadow-2xs">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-slate-700" /> Track Share
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">PERCENTAGE SHARE</span>
            </div>

            <div className="w-full h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trackData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count">
                    {trackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Track Bar Chart */}
          <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[360px] bg-white border-slate-200 shadow-2xs">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-700" /> Team Volume by Track
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">REALTIME COUNT</span>
            </div>

            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackData}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} name="Teams" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* COLLEGE ANALYTICS & LEADERBOARD SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">College Participation Leaderboard</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Colleges Pie Chart */}
          <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[380px] bg-white border-slate-200 shadow-2xs">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-slate-700" /> Top Colleges Share
              </h3>
            </div>

            {collegePieData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                No college data registered.
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={collegePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {collegePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          {/* College Leaderboard Table */}
          <GlassCard variant="default" className="lg:col-span-2 p-5 overflow-hidden bg-white border-slate-200 shadow-2xs">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-700" /> Institutional Leaderboard
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">{collegeStats.length} Total Colleges</span>
            </div>

            {collegeStats.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No college records found in Firestore.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">College Name</th>
                      <th className="p-3">Teams</th>
                      <th className="p-3">Participants</th>
                      <th className="p-3">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {collegeStats.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-400">#{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{col.collegeName}</td>
                        <td className="p-3 font-medium text-slate-800">{col.totalTeams} Teams</td>
                        <td className="p-3 font-medium text-slate-800">{col.totalParticipants} Participants</td>
                        <td className="p-3 font-semibold text-emerald-700">{col.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
