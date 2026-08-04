import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { EditTeamModal } from '../components/teams/EditTeamModal';
import { formatISTDateTime } from '../utils/formatters';
import type { Team } from '../types/team';
import {
  UserCheck,
  Search,
  Filter,
  Mail,
  Phone,
  GraduationCap,
  GitBranch,
  Edit3,
  Trash2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ParticipantsPage: React.FC = () => {
  const { participants, teams, updateTeam, deleteTeam } = useCommandCenter();
  const { executeAdminAction } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filtered = participants.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.college.toLowerCase().includes(search.toLowerCase()) ||
      p.teamName.toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === 'All' || p.track === trackFilter;
    const matchesRole = roleFilter === 'All' || p.role === roleFilter;

    return matchesSearch && matchesTrack && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedParticipants = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditParticipantTeam = (teamId: string) => {
    const foundTeam = teams.find(t => t.id === teamId);
    if (foundTeam) {
      executeAdminAction(() => {
        setEditingTeam(foundTeam);
      });
    }
  };

  const handleDeleteParticipantTeam = (teamId: string, teamName: string) => {
    executeAdminAction(async () => {
      if (window.confirm(`Are you sure you want to delete Team "${teamName}" and all its participant records from Firestore?`)) {
        await deleteTeam(teamId);
      }
    });
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* HEADER */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" /> PARTICIPANT DIRECTORY CARDS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          INSPECT AND MANAGE {participants.length} REGISTERED HACKATHON PARTICIPANTS (IST TIMESTAMPS)
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <GlassCard variant="default" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search Participant Name, Email, College, Team..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-emerald-500/50 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Track:
            <select
              value={trackFilter}
              onChange={e => { setTrackFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
            >
              <option value="All">All Tracks</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environment">Environment</option>
              <option value="AI & Robotics">AI & Robotics</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Open Hardware">Open Hardware</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            Role:
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Leader">Team Leader</option>
              <option value="Member">Team Member</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* GRID OF PARTICIPANT CARDS */}
      {paginatedParticipants.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs font-mono border border-slate-800 rounded-2xl bg-slate-950/60">
          No participant records found in Firestore.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedParticipants.map(p => (
            <GlassCard
              key={p.id}
              variant="default"
              className="p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:scale-[1.01] group"
            >
              <div>
                {/* Top Card Header with Photo Icon & Role */}
                <div className="flex items-start gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-300">{p.name}</h3>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                          p.role === 'Leader'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {p.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-mono truncate mt-0.5">{p.teamName}</p>
                  </div>
                </div>

                {/* Participant Details */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{p.college} ({p.year})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <Calendar className="w-3 h-3 text-slate-600 shrink-0" />
                    <span>Registered: {formatISTDateTime(p.registeredAt)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions & GitHub */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30 font-bold">
                  {p.track}
                </span>

                <div className="flex items-center gap-2">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> GitHub
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">No GitHub</span>
                  )}
                  <button
                    onClick={() => handleEditParticipantTeam(p.teamId)}
                    title="Edit Team Details"
                    className="p-1 rounded bg-slate-900 text-cyan-400 hover:bg-slate-800"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteParticipantTeam(p.teamId, p.teamName)}
                    title="Delete Team Response"
                    className="p-1 rounded bg-slate-900 text-pink-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
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

      {/* Edit Modal */}
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
