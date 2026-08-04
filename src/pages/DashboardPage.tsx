import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { TeamProfileDrawer } from '../components/teams/TeamProfileDrawer';
import { EditTeamModal } from '../components/teams/EditTeamModal';
import { exportTeamPDF } from '../services/exportService';
import { formatISTDateTime, formatDuration } from '../utils/formatters';
import type { Team } from '../types/team';
import {
  Eye,
  Users,
  UserCheck,
  Zap,
  HeartPulse,
  Leaf,
  Clock,
  Activity,
  CheckCircle2,
  Monitor,
  Smartphone,
  TrendingUp,
  Search,
  Trash2,
  Edit3,
  Download,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    teams,
    metrics,
    quickInsights,
    activities,
    updateTeam,
    deleteTeam,
    selectedTeam,
    setSelectedTeam
  } = useCommandCenter();

  const { executeAdminAction } = useAdminAuth();

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered & Paginated Teams
  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.track.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage) || 1;
  const paginatedTeams = filteredTeams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditClick = (team: Team) => {
    executeAdminAction(() => {
      setEditingTeam(team);
    });
  };

  const handleDeleteClick = (team: Team) => {
    executeAdminAction(async () => {
      if (window.confirm(`Are you sure you want to delete Team "${team.name}" (ID: ${team.id}) from Firestore?`)) {
        await deleteTeam(team.id);
      }
    });
  };

  const metricCards = [
    { title: 'Total Website Visits', value: metrics.totalVisits, icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/30', growth: '+18.4%' },
    { title: 'Live Visitors', value: metrics.activeUsersOnline, icon: Activity, color: 'text-emerald-400', border: 'border-emerald-500/30', growth: 'Realtime' },
    { title: 'Total Teams', value: metrics.totalTeams, icon: Users, color: 'text-purple-400', border: 'border-purple-500/30', growth: '+12.5%' },
    { title: 'Total Participants', value: metrics.totalParticipants, icon: UserCheck, color: 'text-amber-400', border: 'border-amber-500/30', growth: '+24.1%' },
    { title: "Today's Registrations", value: metrics.todayRegistrations, icon: Zap, color: 'text-emerald-400', border: 'border-emerald-500/30', growth: 'Today (IST)' },
    { title: 'Healthcare Teams', value: metrics.healthcareTeams, icon: HeartPulse, color: 'text-pink-500', border: 'border-pink-500/30', growth: 'Track Lead' },
    { title: 'Environment Teams', value: metrics.environmentTeams, icon: Leaf, color: 'text-emerald-400', border: 'border-emerald-500/30', growth: 'Active' },
    { title: 'Average Team Size', value: metrics.avgTeamSize, decimals: 1, suffix: ' mbrs', icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/30', growth: 'Avg Size' },
    { title: 'Average Active Time', value: Math.round(metrics.avgActiveTimeSeconds / 60) || 5, suffix: ' mins', icon: Clock, color: 'text-amber-400', border: 'border-amber-500/30', growth: 'Stay Time' }
  ];

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* LIVE STATUS BAR */}
      <GlassCard variant="glow" className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 🟢 Database Connected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>👥 Active Online: <strong className="text-cyan-400">{metrics.activeUsersOnline}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>🖥 Desktop: <strong className="text-emerald-400">{metrics.activeDesktopUsers}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>📱 Mobile: <strong className="text-amber-400">{metrics.activeMobileUsers}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>👁 Currently Viewing: <strong className="text-purple-400">{metrics.currentlyViewing}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-300" />
              <span>⏱ Avg Active: <strong className="text-white">{formatDuration(metrics.avgActiveTimeSeconds)}</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Last Updated: <span className="text-cyan-400 font-bold">{metrics.lastUpdatedIST}</span>
          </div>
        </div>
      </GlassCard>

      {/* LARGE ANIMATED METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard
              key={idx}
              variant="default"
              className={`p-4 flex flex-col justify-between h-36 border ${card.border} hover:border-cyan-400/60 hover:scale-[1.02] transition-all cursor-pointer group`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-black text-white tracking-tight">
                  <AnimatedCounter value={card.value} suffix={card.suffix || ''} decimals={card.decimals || 0} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.growth}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* QUICK INSIGHTS CARDS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">AUTOMATED QUICK INSIGHTS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickInsights.map(insight => (
            <GlassCard key={insight.id} variant="glow" className="p-4 border-l-4 border-l-cyan-400 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">{insight.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{insight.summary}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* MAIN GRID: RECENT ACTIVITY TIMELINE & REGISTRATION OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY TIMELINE */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between">
          <div className="border-b border-cyan-500/20 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> RECENT ACTIVITY TIMELINE
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold">REALTIME STREAM</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent activity logged in Firestore.
              </div>
            ) : (
              activities.slice(0, 10).map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white truncate">{act.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{formatISTDateTime(act.timestamp).split(',')[1]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{act.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* REGISTRATION OVERVIEW WIDGET */}
        <GlassCard variant="default" className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div className="border-b border-cyan-500/20 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> REGISTRATION OVERVIEW
            </h2>
            <span className="text-[10px] text-slate-400 uppercase font-bold">YODHA STATS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Healthcare Teams</div>
              <div className="text-xl font-black text-pink-400 mt-1">{metrics.healthcareTeams}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Environment Teams</div>
              <div className="text-xl font-black text-emerald-400 mt-1">{metrics.environmentTeams}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Teams</div>
              <div className="text-xl font-black text-cyan-400 mt-1">{metrics.totalTeams}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Participants</div>
              <div className="text-xl font-black text-amber-400 mt-1">{metrics.totalParticipants}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Average Team Size</div>
              <div className="text-xl font-black text-purple-400 mt-1">{metrics.avgTeamSize}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Largest Team</div>
              <div className="text-xl font-black text-cyan-300 mt-1">{metrics.largestTeamSize} Members</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Today's Registrations</div>
              <div className="text-xl font-black text-emerald-400 mt-1">{metrics.todayRegistrations}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">This Week</div>
              <div className="text-xl font-black text-amber-400 mt-1">{metrics.registrationsThisWeek}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* REGISTRATION TABLE WITH SEARCH, PAGINATION & DRAWER */}
      <GlassCard variant="default" className="p-5 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> REGISTRATION RESPONSES TABLE ({filteredTeams.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">SEARCH, VIEW PROFILE DRAWER, EDIT, DELETE & EXPORT RESPONSES</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search Team, Leader, College, Track..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none w-64 font-mono"
              />
            </div>
          </div>
        </div>

        {paginatedTeams.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No registration records found in Firestore.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-cyan-400 uppercase border-b border-cyan-500/20">
                <tr>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Leader</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Date (IST)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">{team.name}</td>
                    <td className="p-3 font-medium text-slate-200">{team.leaderName}</td>
                    <td className="p-3 text-slate-300">{team.college}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {team.track}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-200">{team.members.length}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{formatISTDateTime(team.createdAt)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTeam(team)}
                          title="View Full Profile Drawer"
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => handleEditClick(team)}
                          title="Edit Team Response"
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => exportTeamPDF(team)}
                          title="Export Team PDF"
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(team)}
                          title="Delete Response from Firestore"
                          className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
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

      {/* Team Profile Drawer */}
      <TeamProfileDrawer team={selectedTeam} onClose={() => setSelectedTeam(null)} />

      {/* Edit Response Modal */}
      <EditTeamModal
        team={editingTeam}
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSave={async (updated) => {
          await updateTeam(updated);
        }}
      />
    </div>
  );
};
