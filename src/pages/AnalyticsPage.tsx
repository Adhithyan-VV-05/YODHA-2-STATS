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
    { name: 'Healthcare', count: healthcareCount, pct: Number(((healthcareCount / total) * 100).toFixed(1)), color: '#ff0055' },
    { name: 'Environment', count: environmentCount, pct: Number(((environmentCount / total) * 100).toFixed(1)), color: '#00ff9d' },
    { name: 'AI & Robotics', count: aiCount, pct: Number(((aiCount / total) * 100).toFixed(1)), color: '#00f3ff' },
    { name: 'Cybersecurity', count: cyberCount, pct: Number(((cyberCount / total) * 100).toFixed(1)), color: '#9d4edd' },
    { name: 'Open Hardware', count: openHardwareCount, pct: Number(((openHardwareCount / total) * 100).toFixed(1)), color: '#ffaa00' }
  ];

  const collegePieData = collegeStats.slice(0, 5).map((col, idx) => ({
    name: col.collegeName,
    value: col.totalParticipants,
    color: ['#00f3ff', '#00ff9d', '#ffaa00', '#9d4edd', '#ff0055'][idx % 5]
  }));

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* HEADER */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-cyan-400" /> HACKATHON TRACK & COLLEGE ANALYTICS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ANALYSIS BASED EXCLUSIVELY ON FIRESTORE REGISTRATIONS AND PARTICIPANT DATA
        </p>
      </div>

      {/* TRACK ANALYTICS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">TRACK ANALYTICS (HEALTHCARE & ENVIRONMENT)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Track Pie Chart */}
          <GlassCard variant="glow" className="p-5 flex flex-col justify-between h-[360px]">
            <div className="border-b border-cyan-500/20 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-pink-500" /> Track Distribution Pie Chart
              </h3>
              <span className="text-[10px] text-pink-400 font-bold">PERCENTAGE SHARE</span>
            </div>

            <div className="w-full h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trackData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count">
                    {trackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#ff0055', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Track Bar Chart & Percentages */}
          <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[360px]">
            <div className="border-b border-cyan-500/20 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Track Team Volume Bar Chart
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">REALTIME COUNT</span>
            </div>

            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackData}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#00ff9d', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#00ff9d" radius={[6, 6, 0, 0]} name="Teams" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* COLLEGE ANALYTICS & LEADERBOARD SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">COLLEGE ANALYTICS & INSTITUTIONAL LEADERBOARD</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Colleges Pie Chart */}
          <GlassCard variant="default" className="p-5 flex flex-col justify-between h-[380px]">
            <div className="border-b border-cyan-500/20 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-400" /> Top College Share Pie Chart
              </h3>
            </div>

            {collegePieData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
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
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffaa00', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          {/* College Leaderboard Table */}
          <GlassCard variant="default" className="lg:col-span-2 p-5 overflow-hidden">
            <div className="border-b border-cyan-500/20 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> College Participation Leaderboard
              </h3>
              <span className="text-[10px] text-cyan-400 font-bold">{collegeStats.length} Total Colleges</span>
            </div>

            {collegeStats.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No college records found in Firestore.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-cyan-400 uppercase border-b border-cyan-500/20">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">College Name</th>
                      <th className="p-3">Teams</th>
                      <th className="p-3">Participants</th>
                      <th className="p-3">Volume Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {collegeStats.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                        <td className="p-3 font-bold text-white">{col.collegeName}</td>
                        <td className="p-3 font-bold text-cyan-400">{col.totalTeams} Teams</td>
                        <td className="p-3 font-bold text-amber-400">{col.totalParticipants} Participants</td>
                        <td className="p-3 font-bold text-emerald-400">{col.percentage}%</td>
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
