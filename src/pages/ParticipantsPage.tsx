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
  Calendar
} from 'lucide-react';

export const ParticipantsPage: React.FC = () => {
  const { participants, teams, updateTeam, deleteTeam } = useCommandCenter();
  const { executeAdminAction } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

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
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-slate-700" /> Participant Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect and manage {participants.length} registered hackathon participants (Time Ordered)
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <GlassCard variant="default" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-slate-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Participant Name, Email, College, Team..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-slate-400 focus:bg-white outline-none font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Track:
            <select
              value={trackFilter}
              onChange={e => setTrackFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-md px-2.5 py-1.5 text-xs outline-none font-sans"
            >
              <option value="All">All Tracks</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environment">Environment</option>
              <option value="AI & Robotics">AI & Robotics</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Open Hardware">Open Hardware</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            Role:
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-md px-2.5 py-1.5 text-xs outline-none font-sans"
            >
              <option value="All">All Roles</option>
              <option value="Leader">Team Leader</option>
              <option value="Member">Team Member</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* GRID OF PARTICIPANT CARDS - FULL LIST */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs font-sans border border-slate-200 rounded-xl bg-white">
          No participant records found in Firestore.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, index) => (
            <GlassCard
              key={p.id}
              variant="default"
              className="p-4 flex flex-col justify-between hover:border-slate-300 transition-all bg-white border-slate-200 group shadow-2xs relative"
            >
              <div>
                {/* Top Card Header */}
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-mono font-bold text-xs">
                    #{index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{p.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          p.role === 'Leader'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {p.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">{p.teamName}</p>
                  </div>
                </div>

                {/* Participant Details */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.college} ({p.year})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Registered: {formatISTDateTime(p.registeredAt)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions & GitHub */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {p.track}
                </span>

                <div className="flex items-center gap-2">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-800 hover:underline font-semibold"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> GitHub
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No GitHub</span>
                  )}
                  <button
                    onClick={() => handleEditParticipantTeam(p.teamId)}
                    title="Edit Team Details"
                    className="p-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteParticipantTeam(p.teamId, p.teamName)}
                    title="Delete Team Response"
                    className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
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

export default ParticipantsPage;

