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
  Gift,
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
    { title: 'Total Website Visits', value: metrics.totalVisits, icon: Eye, growth: '+18.4%' },
    { title: 'Live Visitors', value: metrics.activeUsersOnline, icon: Activity, growth: 'Realtime' },
    { title: 'Total Teams', value: metrics.totalTeams, icon: Users, growth: '+12.5%' },
    { title: 'Total Participants', value: metrics.totalParticipants, icon: UserCheck, growth: '+24.1%' },
    { title: "Today's Registrations", value: metrics.todayRegistrations, icon: Zap, growth: 'Today' },
    { title: 'Referral Codes', value: metrics.totalReferralCodes || 0, icon: Gift, growth: 'Active Rooms' },
    { title: 'Successful Referrals', value: metrics.totalSuccessfulReferrals || 0, icon: Gift, growth: 'Referred Teams' },
    { title: 'Healthcare Teams', value: metrics.healthcareTeams, icon: HeartPulse, growth: 'Track Lead' },
    { title: 'Environment Teams', value: metrics.environmentTeams, icon: Leaf, growth: 'Active' },
    { title: 'Average Team Size', value: metrics.avgTeamSize, decimals: 1, suffix: ' members', icon: Users, growth: 'Avg Size' },
    { title: 'Average Active Time', value: Math.round(metrics.avgActiveTimeSeconds / 60) || 5, suffix: ' mins', icon: Clock, growth: 'Stay Time' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* LIVE STATUS BAR */}
      <GlassCard variant="default" className="p-4 bg-white border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database Live Sync Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Active Online: <strong className="text-slate-900">{metrics.activeUsersOnline}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              <span>Desktop: <strong className="text-slate-900">{metrics.activeDesktopUsers}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Mobile: <strong className="text-slate-900">{metrics.activeMobileUsers}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Viewing: <strong className="text-slate-900">{metrics.currentlyViewing}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Avg Active: <strong className="text-slate-900">{formatDuration(metrics.avgActiveTimeSeconds)}</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Last Synced: <span className="text-slate-700 font-semibold">{metrics.lastUpdatedIST}</span>
          </div>
        </div>
      </GlassCard>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard
              key={idx}
              variant="default"
              className="p-4 flex flex-col justify-between h-36 bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{card.title}</span>
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-slate-200 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter value={card.value} suffix={card.suffix || ''} decimals={card.decimals || 0} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
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
          <Sparkles className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Automated Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickInsights.map(insight => (
            <GlassCard key={insight.id} variant="default" className="p-4 border-l-4 border-l-slate-900 flex items-start gap-3 bg-white border-slate-200">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{insight.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{insight.summary}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* MAIN GRID: RECENT ACTIVITY & REGISTRATION OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY TIMELINE */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" /> Recent Activity Stream
            </h2>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Live</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No recent activity logged in Firestore.
              </div>
            ) : (
              activities.slice(0, 10).map((act) => (
                <div key={act.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 truncate">{act.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{formatISTDateTime(act.timestamp).split(',')[1]}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{act.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* REGISTRATION OVERVIEW WIDGET */}
        <GlassCard variant="default" className="lg:col-span-2 p-5 flex flex-col justify-between bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" /> Registration Overview
            </h2>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">YODHA 2.0</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Healthcare Teams</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.healthcareTeams}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Environment Teams</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.environmentTeams}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Teams</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalTeams}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Participants</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalParticipants}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Average Team Size</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.avgTeamSize}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Largest Team</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.largestTeamSize} Members</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Today's Registrations</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.todayRegistrations}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">This Week</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.registrationsThisWeek}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* REGISTRATION TABLE WITH SEARCH & PAGINATION */}
      <GlassCard variant="default" className="p-5 overflow-hidden bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" /> Registration Responses ({filteredTeams.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Search, view team profile, edit, delete & export responses</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search Team, Leader, College, Track..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-slate-400 focus:bg-white outline-none w-64 font-sans"
              />
            </div>
          </div>
        </div>

        {paginatedTeams.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-sans">
            No registration records found in Firestore.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Leader</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Registered (IST)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">{team.name}</td>
                    <td className="p-3 font-medium text-slate-800">{team.leaderName}</td>
                    <td className="p-3 text-slate-600">{team.college}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {team.track}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{team.members.length}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{formatISTDateTime(team.createdAt)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTeam(team)}
                          title="View Full Profile Drawer"
                          className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => handleEditClick(team)}
                          title="Edit Team Response"
                          className="p-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => exportTeamPDF(team)}
                          title="Export Team PDF"
                          className="p-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(team)}
                          title="Delete Response from Firestore"
                          className="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
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
