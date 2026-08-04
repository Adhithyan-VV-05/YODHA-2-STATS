import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { TeamProfileDrawer } from '../components/teams/TeamProfileDrawer';
import { EditTeamModal } from '../components/teams/EditTeamModal';
import { exportTeamsToCSV, exportTeamsToExcel, exportTeamsToJSON, exportTeamPDF } from '../services/exportService';
import { formatISTDateTime } from '../utils/formatters';
import type { Team } from '../types/team';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit3,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const {
    teams,
    selectedTeam,
    setSelectedTeam,
    updateTeam,
    deleteTeam,
    updateTeamStatus
  } = useCommandCenter();

  const { executeAdminAction } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filteredTeams = teams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(search.toLowerCase()) ||
      t.college.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === 'All' || t.track === trackFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

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

  const handleStatusToggle = (team: Team) => {
    executeAdminAction(async () => {
      const nextStatus = team.status === 'Verified' ? 'Pending Review' : 'Verified';
      await updateTeamStatus(team.id, nextStatus);
    });
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" /> TEAM MANAGEMENT & ROSTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            INSPECT, EDIT AND MANAGE {teams.length} HACKATHON TEAMS IN REAL TIME (IST)
          </p>
        </div>

        {/* Multi-Format Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTeamsToCSV(filteredTeams)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> CSV
          </button>
          <button
            onClick={() => exportTeamsToExcel(filteredTeams)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
          </button>
          <button
            onClick={() => exportTeamsToJSON(filteredTeams)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" /> JSON
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <GlassCard variant="default" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Team Name, Leader, College, ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-cyan-500/50 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Track:
            <select
              value={trackFilter}
              onChange={e => setTrackFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
            >
              <option value="All">All Tracks</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environment">Environment</option>
              <option value="AI & Robotics">AI & Robotics</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            Status:
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Teams Table */}
      <GlassCard variant="default" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-cyan-400 uppercase border-b border-cyan-500/20">
              <tr>
                <th className="p-4">Team ID / Name</th>
                <th className="p-4">Leader</th>
                <th className="p-4">College</th>
                <th className="p-4">Track</th>
                <th className="p-4">Registered (IST)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-slate-900/60 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-cyan-300">{team.name}</div>
                    <div className="text-[10px] text-slate-500">{team.id} ({team.members.length} Members)</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200 font-medium">{team.leaderName}</div>
                    <div className="text-[10px] text-slate-400">{team.leaderEmail}</div>
                  </td>
                  <td className="p-4 text-slate-300">{team.college}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {team.track}
                    </span>
                  </td>
                  <td className="p-4 text-[11px] text-slate-400">
                    {formatISTDateTime(team.createdAt)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusToggle(team)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                        team.status === 'Verified'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {team.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedTeam(team)}
                        title="View Full Team Profile"
                        className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(team)}
                        title="Edit Team Details"
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
      </GlassCard>

      {/* Team Profile Drawer Modal */}
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
