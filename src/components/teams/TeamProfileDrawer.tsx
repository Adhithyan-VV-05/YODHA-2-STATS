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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs font-sans overflow-y-auto">
      <div className="w-full max-w-2xl h-full bg-white border-l border-slate-200 p-6 flex flex-col font-sans overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Team Profile ({team.id})
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{team.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTeamPDF(team)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track & Status Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs">
              Track: {team.track}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Status: {team.status}
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Registered: {formatISTDateTime(team.createdAt)}</span>
          </div>
        </div>

        {/* Project Brief */}
        {team.projectDescription && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Project Brief</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{team.projectDescription}</p>
          </div>
        )}

        {/* Leader Card */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-700" /> Team Leader Profile
          </h3>

          {team.members.filter(m => m.role === 'Leader').concat(team.members.slice(0, 1)).slice(0, 1).map(leader => (
            <div
              key={leader.id}
              className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">{leader.name}</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-white font-semibold">Leader</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {leader.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {leader.phone}</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-slate-400" /> {leader.college} ({leader.year})</div>
                {leader.githubUrl && (
                  <a href={leader.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-800 font-semibold hover:underline">
                    <GitBranch className="w-3.5 h-3.5" /> GitHub Profile
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Members List */}
        <div className="mb-6 flex-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
            Team Members ({team.members.length})
          </h3>
          <div className="space-y-2.5">
            {team.members.map((mbr, idx) => (
              <div
                key={mbr.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Member #{idx + 1}: {mbr.name} ({mbr.role})</span>
                  <span className="text-slate-500 text-[11px] font-normal">{mbr.gender} • {mbr.year}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
                  <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-400" /> {mbr.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-slate-400" /> {mbr.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => exportTeamsToJSON([team], `${team.name}_Data.json`)}
            className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" /> Export JSON
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 font-semibold shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-300" /> Print Profile
          </button>
        </div>
      </div>
    </div>
  );
};
