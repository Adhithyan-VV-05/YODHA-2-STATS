import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { TeamProfileDrawer } from '../components/teams/TeamProfileDrawer';
import { EditTeamModal } from '../components/teams/EditTeamModal';
import { exportTeamPDF } from '../services/exportService';
import { formatISTDateTime } from '../utils/formatters';
import type { Team } from '../types/team';
import {
  Eye,
  Users,
  UserCheck,
  Zap,
  HeartPulse,
  Leaf,
  Activity,
  CheckCircle2,
  TrendingUp,
  Search,
  Trash2,
  Edit3,
  Download,
  Sparkles,
  Gift,
  Layers,
  Award
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    teams,
    selectedTeams,
    metrics,
    quickInsights,
    activities,
    updateTeam,
    deleteTeam,
    bulkDeleteTeams,
    toggleShortlistTeam,
    selectedTeam,
    setSelectedTeam
  } = useCommandCenter();

  const { executeAdminAction } = useAdminAuth();

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered Teams (Full list sorted by time)
  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.driveLink || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.pptLink || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTeams.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    executeAdminAction(async () => {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected team(s)?`)) {
        await bulkDeleteTeams(selectedIds);
        setSelectedIds([]);
      }
    });
  };

  const handleEditClick = (team: Team) => {
    executeAdminAction(() => {
      setEditingTeam(team);
    });
  };

  const handleDeleteClick = (team: Team) => {
    executeAdminAction(async () => {
      if (window.confirm(`Are you sure you want to delete Team "${team.name}" (ID: ${team.id}) from Firestore?`)) {
        await deleteTeam(team.id);
        setSelectedIds(prev => prev.filter(id => id !== team.id));
      }
    });
  };

  const metricCards = [
    { title: 'Total Visitors So Far', value: metrics.totalVisits, icon: Eye, growth: 'Total Visits' },
    { title: 'Total Teams Registered', value: metrics.totalTeams, icon: Users, growth: 'Teams' },
    { title: 'Shortlisted Teams', value: selectedTeams.length, icon: Award, growth: 'Shortlisted' },
    { title: 'Total Participants', value: metrics.totalParticipants, icon: UserCheck, growth: 'Participants' },
    { title: "Today's Registrations", value: metrics.todayRegistrations, icon: Zap, growth: 'Today' },
    { title: 'Referral Rooms', value: metrics.totalReferralCodes || 0, icon: Gift, growth: 'Referrals' },
    { title: 'Healthcare Teams', value: metrics.healthcareTeams, icon: HeartPulse, growth: 'Healthcare' },
    { title: 'Environment Teams', value: metrics.environmentTeams, icon: Leaf, growth: 'Environment' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* DATABASE SYNC STATUS BAR */}
      <GlassCard variant="default" className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database Realtime Live Sync Active
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Last Synced IST: <span className="text-slate-800 font-semibold">{metrics.lastUpdatedIST}</span>
          </div>
        </div>
      </GlassCard>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard
              key={idx}
              variant="default"
              className="p-4 flex flex-col justify-between h-32 bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{card.title}</span>
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-slate-200 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                  <AnimatedCounter value={card.value} />
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
              <Layers className="w-4 h-4 text-slate-700" /> Registration Breakdown
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

      {/* REGISTRATION TABLE - FULL LIST, NO PAGINATION, TIME ORDERED S.NO */}
      <GlassCard variant="default" className="p-5 overflow-hidden bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" /> Registration Responses ({filteredTeams.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Full time-sorted registration responses list</p>
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
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Team, Leader, College, Track..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-slate-400 focus:bg-white outline-none w-64 font-sans"
              />
            </div>
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-sans">
            No registration records found in Firestore.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 w-12 text-slate-400">#</th>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Leader</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Drive Link</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Registered (IST)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTeams.map((team, index) => {
                  const driveLink = team.driveLink || team.pptLink;
                  const isSelected = selectedIds.includes(team.id);

                  return (
                    <tr key={team.id} className={`transition-colors ${isSelected ? 'bg-slate-100/70' : 'hover:bg-slate-50/80'}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(team.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">{team.name}</td>
                      <td className="p-3 font-medium text-slate-800">{team.leaderName}</td>
                      <td className="p-3 text-slate-600">{team.college}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {team.track}
                        </span>
                      </td>
                      <td className="p-3">
                        {driveLink ? (
                          <a
                            href={driveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-mono font-semibold transition-all"
                          >
                            📁 Drive Link ↗
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono italic">No Link</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{team.members.length}</td>
                      <td className="p-3 text-slate-500 text-[11px] font-mono">{formatISTDateTime(team.createdAt)}</td>
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
                  );
                })}
              </tbody>
            </table>
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

export default DashboardPage;

