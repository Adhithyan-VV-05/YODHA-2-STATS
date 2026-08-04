import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useCommandCenter } from '../context/CommandCenterContext';
import { exportTeamsToCSV, exportTeamsToExcel, exportTeamsToJSON } from '../services/exportService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Download,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Users,
  Eye,
  GraduationCap
} from 'lucide-react';

export const ExportsPage: React.FC = () => {
  const { teams, participants, sessions, collegeStats } = useCommandCenter();

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Dark Header
    doc.setFillColor(6, 8, 13);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(0, 243, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('YODHA COMMAND CENTER', 14, 20);

    doc.setTextColor(200, 200, 220);
    doc.setFontSize(10);
    doc.text(`OFFICIAL EXECUTIVE HACKATHON DOSSIER REPORT`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 14, 36);

    // Summary Section
    doc.setTextColor(20, 20, 30);
    doc.setFontSize(12);
    doc.text('SUMMARY METRICS', 14, 55);

    doc.setFontSize(10);
    doc.text(`Total Teams Registered: ${teams.length}`, 14, 63);
    doc.text(`Total Participants Scouted: ${participants.length}`, 14, 69);
    doc.text(`Total Colleges Registered: ${collegeStats.length}`, 14, 75);
    doc.text(`Total Visitor Sessions Logged: ${sessions.length}`, 14, 81);

    // Teams Table
    const tableData = teams.slice(0, 15).map((t, i) => [
      `#${i + 1}`,
      t.name,
      t.leaderName,
      t.college,
      t.track,
      `${t.members.length} Mbrs`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['#', 'Team Name', 'Leader', 'College', 'Track', 'Members']],
      body: tableData,
      headStyles: { fillColor: [13, 17, 26], textColor: [0, 243, 255] }
    });

    doc.save(`YODHA_Executive_Hackathon_Report.pdf`);
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* HEADER */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" /> MULTI-FORMAT DATA EXPORT HUB
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          EXPORT REAL FIRESTORE DATASETS IN CSV, EXCEL, PDF DOSSIER AND JSON FORMATS
        </p>
      </div>

      {/* EXPORT OPTIONS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CSV EXPORT */}
        <GlassCard variant="glow" className="p-5 flex flex-col justify-between h-56 border-cyan-500/30">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">CSV Format</span>
              <Download className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Export CSV Dataset</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Full tab-separated registration records suitable for data analysis.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToCSV(teams)}
            className="w-full py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-500/30 text-xs transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download CSV ({teams.length} Teams)
          </button>
        </GlassCard>

        {/* EXCEL EXPORT */}
        <GlassCard variant="glow" className="p-5 flex flex-col justify-between h-56 border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Excel Workbook</span>
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Export Excel (.xlsx)</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Spreadsheet containing team rosters, participant emails, and phone records.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToExcel(teams)}
            className="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-500/30 text-xs transition-all flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Excel Worksheets
          </button>
        </GlassCard>

        {/* PDF EXPORT */}
        <GlassCard variant="glow" className="p-5 flex flex-col justify-between h-56 border-purple-500/30">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Executive PDF</span>
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">Export Executive PDF</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Formatted executive dossier PDF summary for organizers and stakeholders.
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className="w-full py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-500/30 text-xs transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Download Executive PDF
          </button>
        </GlassCard>

        {/* JSON EXPORT */}
        <GlassCard variant="glow" className="p-5 flex flex-col justify-between h-56 border-amber-500/30">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">JSON Payload</span>
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">Export Raw JSON</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Full structured JSON object representation of the Firestore database.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToJSON(teams)}
            className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 text-xs transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export JSON Objects
          </button>
        </GlassCard>
      </div>

      {/* DATASET SUMMARY */}
      <GlassCard variant="default" className="p-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-3 mb-4">
          AVAILABLE FIRESTORE DATASETS FOR EXPORT
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="font-bold text-white">{teams.length} Teams Registered</div>
              <div className="text-[11px] text-slate-400">{participants.length} Total Members</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <div>
              <div className="font-bold text-white">{collegeStats.length} Institutions</div>
              <div className="text-[11px] text-slate-400">Ranked by volume</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Eye className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-white">{sessions.length} Visitor Sessions</div>
              <div className="text-[11px] text-slate-400">user_sessions collection</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
