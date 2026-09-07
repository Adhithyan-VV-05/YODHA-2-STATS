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
  FileText,
  CheckSquare,
  Square,
  CheckCircle2,
  Award
} from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const {
    teams,
    selectedTeam,
    setSelectedTeam,
    updateTeam,
    deleteTeam,
    toggleShortlistTeam,
    bulkDeleteTeams
  } = useCommandCenter();

  const { executeAdminAction } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Multi-Record Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredTeams = teams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(search.toLowerCase()) ||
      t.college.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.driveLink || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.pptLink || '').toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === 'All' || t.track === trackFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

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
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected team(s) from Firestore?`)) {
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

  const handleToggleShortlist = (team: Team) => {
    executeAdminAction(async () => {
      const isCurrentlyShortlisted = team.status === 'Shortlisted';
      await toggleShortlistTeam(team, !isCurrentlyShortlisted);
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" /> Team Management & Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect, edit, shortlist, and manage all {teams.length} teams sorted strictly by time
          </p>
        </div>

        {/* Multi-Format Export & Bulk Delete Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs animate-fadeIn"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => exportTeamsToCSV(filteredTeams)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> CSV Export
          </button>
          <button
            onClick={() => exportTeamsToExcel(filteredTeams)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel (All Members)
          </button>
          <button
            onClick={() => exportTeamsToJSON(filteredTeams)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" /> JSON
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <GlassCard variant="default" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-slate-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Team Name, Leader, College, ID, Drive Link..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-slate-400 focus:bg-white outline-none font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Track:
            <select
              value={trackFilter}
              onChange={e => setTrackFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-md px-2 py-1.5 text-xs outline-none font-sans"
            >
              <option value="All">All Tracks</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environment">Environment</option>
              <option value="AI & Robotics">AI & Robotics</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            Status:
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-md px-2 py-1.5 text-xs outline-none font-sans"
            >
              <option value="All">All Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Verified">Verified</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Teams Table - FULL LIST, NO PAGINATION, S.NO TIME ORDERED */}
      <GlassCard variant="default" className="p-0 overflow-hidden bg-white border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-4 w-12 text-slate-400">#</th>
                <th className="p-4">Shortlist</th>
                <th className="p-4">Team Name / ID</th>
                <th className="p-4">Leader Details</th>
                <th className="p-4">College</th>
                <th className="p-4">Track</th>
                <th className="p-4">Drive Link</th>
                <th className="p-4">Registered (IST)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTeams.map((team, index) => {
                const driveLink = team.driveLink || team.pptLink;
                const isSelected = selectedIds.includes(team.id);
                const isShortlisted = team.status === 'Shortlisted';

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors group ${
                      isSelected ? 'bg-slate-100/70' : isShortlisted ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Multi-Select Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(team.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* S.No Time Order */}
                    <td className="p-4 font-mono font-bold text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Shortlist Action Checkbox / Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleShortlist(team)}
                        title={isShortlisted ? 'Click to cancel shortlist' : 'Click to Shortlist & Sync team'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          isShortlisted
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                        }`}
                      >
                        <Award className={`w-3.5 h-3.5 ${isShortlisted ? 'text-white' : 'text-slate-400'}`} />
                        <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}</span>
                      </button>
                    </td>

                    {/* Team Name / ID */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 group-hover:text-slate-950">{team.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{team.id} ({team.members.length} Members)</div>
                    </td>

                    {/* Leader Details */}
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{team.leaderName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{team.leaderEmail}</div>
                      {team.leaderPhone && <div className="text-[10px] text-slate-400 font-mono">{team.leaderPhone}</div>}
                    </td>

                    {/* College */}
                    <td className="p-4 text-slate-600">{team.college}</td>

                    {/* Track */}
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {team.track}
                      </span>
                    </td>

                    {/* Drive Link */}
                    <td className="p-4">
                      {driveLink ? (
                        <a
                          href={driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-mono font-semibold transition-all"
                        >
                          📁 Drive Link ↗
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono italic">No Link</span>
                      )}
                    </td>

                    {/* Registration Time */}
                    <td className="p-4 text-[11px] text-slate-500 font-mono">
                      {formatISTDateTime(team.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          team.status === 'Shortlisted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : team.status === 'Verified'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {team.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTeam(team)}
                          title="View Full Team Dossier"
                          className="p-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(team)}
                          title="Edit Team Details"
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

export default TeamsPage;

