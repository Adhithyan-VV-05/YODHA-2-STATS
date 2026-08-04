import React from 'react';
import type { Team } from '../../types/team';
import { X, Mail, Phone, GraduationCap, GitBranch, Calendar, FileText, Download, Printer, Shield } from 'lucide-react';
import { exportTeamPDF, exportTeamsToJSON } from '../../services/exportService';
import { formatISTDateTime } from '../../utils/formatters';

interface TeamProfileDrawerProps {
  team: Team | null;
  onClose: () => void;
}

export const TeamProfileDrawer: React.FC<TeamProfileDrawerProps> = ({ team, onClose }) => {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md font-mono overflow-y-auto">
      <div className="w-full max-w-2xl h-full bg-slate-950 border-l border-cyan-500/30 p-6 flex flex-col font-mono overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
              TEAM DOSSIER // {team.id}
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mt-1">{team.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTeamPDF(team)}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track & Status Banner */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              TRACK: {team.track}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STATUS: {team.status}
            </span>
          </div>
          <div className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Registered: {formatISTDateTime(team.createdAt)}</span>
          </div>
        </div>

        {/* Project Description */}
        {team.projectDescription && (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Brief</h4>
            <p className="text-xs text-slate-200 leading-relaxed">{team.projectDescription}</p>
          </div>
        )}

        {/* Leader Card */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> TEAM LEADER DOSSIER
          </h3>

          {team.members.filter(m => m.role === 'Leader').concat(team.members.slice(0, 1)).slice(0, 1).map(leader => (
            <div
              key={leader.id}
              className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white">{leader.name}</div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-400 text-slate-950 font-bold">LEADER</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {leader.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-cyan-400" /> {leader.phone}</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> {leader.college} ({leader.year})</div>
                {leader.githubUrl && (
                  <a href={leader.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cyan-400 hover:underline">
                    <GitBranch className="w-3.5 h-3.5" /> GitHub Profile
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Members List */}
        <div className="mb-6 flex-1">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            TEAM MEMBERS ({team.members.length})
          </h3>
          <div className="space-y-3">
            {team.members.map((mbr, idx) => (
              <div
                key={mbr.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Member #{idx + 1}: {mbr.name} ({mbr.role})</span>
                  <span className="text-slate-500 text-[10px]">{mbr.gender} • {mbr.year}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-500" /> {mbr.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-slate-500" /> {mbr.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs">
          <button
            onClick={() => exportTeamsToJSON([team], `${team.name}_Data.json`)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Export JSON
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-400" /> Print Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
