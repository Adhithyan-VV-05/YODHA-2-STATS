import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GraduationCap, Award } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';

export const CollegesPage: React.FC = () => {
  const { collegeStats, teams } = useCommandCenter();

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" /> COLLEGES & UNIVERSITIES PARTICIPATION
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          TOTAL COLLEGES REGISTERED: {collegeStats.length} • TOTAL TEAMS: {teams.length}
        </p>
      </div>

      {collegeStats.length === 0 ? (
        <GlassCard variant="default" className="p-12 text-center text-slate-400 text-xs">
          No college registration data available in Firestore yet.
        </GlassCard>
      ) : (
        <>
          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collegeStats.slice(0, 3).map((col, idx) => {
              const colors = [
                'from-amber-500/20 to-slate-900 border-amber-500/40 text-amber-400',
                'from-cyan-500/20 to-slate-900 border-cyan-500/40 text-cyan-400',
                'from-purple-500/20 to-slate-900 border-purple-500/40 text-purple-400'
              ];
              return (
                <GlassCard key={idx} variant="glow" className={`p-5 bg-gradient-to-b ${colors[idx]}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest">RANK #{idx + 1}</span>
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white mt-2">{col.collegeName}</h3>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Teams</div>
                      <div className="text-xl font-extrabold text-white">{col.totalTeams}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Participants</div>
                      <div className="text-xl font-extrabold text-white">{col.totalParticipants}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Share</div>
                      <div className="text-xl font-extrabold text-emerald-400">{col.percentage}%</div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Full Leaderboard Table */}
          <GlassCard variant="default" className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-cyan-400 uppercase border-b border-cyan-500/20">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">College / University Name</th>
                    <th className="p-4">Teams Registered</th>
                    <th className="p-4">Count of Participants</th>
                    <th className="p-4">Avg Team Size</th>
                    <th className="p-4">Volume Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {collegeStats.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-4 font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-4 font-bold text-white">{col.collegeName}</td>
                      <td className="p-4 font-bold text-cyan-400">{col.totalTeams} Teams</td>
                      <td className="p-4 font-bold text-amber-400">{col.totalParticipants} Participants</td>
                      <td className="p-4 text-slate-300">{col.avgTeamSize} Members</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                              style={{ width: `${Math.min(col.percentage * 4, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-emerald-400">{col.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
