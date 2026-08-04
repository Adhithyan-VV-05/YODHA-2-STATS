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

    // Clean Light Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('YODHA 2.0 Dashboard', 14, 20);

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(10);
    doc.text(`Official Executive Hackathon Report`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 14, 36);

    // Summary Section
    doc.setTextColor(15, 23, 42);
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
      `${t.members.length} Members`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['#', 'Team Name', 'Leader', 'College', 'Track', 'Members']],
      body: tableData,
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] }
    });

    doc.save(`YODHA_Executive_Hackathon_Report.pdf`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Download className="w-5 h-5 text-slate-700" /> Data Export Hub
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Export Firestore registration data in CSV, Excel, PDF, and JSON formats
        </p>
      </div>

      {/* EXPORT OPTIONS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CSV EXPORT */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-56 bg-white border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">CSV Format</span>
              <Download className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export CSV Dataset</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Tabular registration records suitable for analytics spreadsheets.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToCSV(teams)}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-300" /> Download CSV ({teams.length} Teams)
          </button>
        </GlassCard>

        {/* EXCEL EXPORT */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-56 bg-white border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Excel Workbook</span>
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Excel (.xlsx)</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Spreadsheet containing team rosters, participant emails, and phone records.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToExcel(teams)}
            className="w-full py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Download Excel Worksheets
          </button>
        </GlassCard>

        {/* PDF EXPORT */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-56 bg-white border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Executive PDF</span>
              <ShieldCheck className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Executive PDF</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Formatted PDF report for hackathon organizers and stakeholders.
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className="w-full py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold hover:bg-slate-200 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-700" /> Download Executive PDF
          </button>
        </GlassCard>

        {/* JSON EXPORT */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between h-56 bg-white border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">JSON Payload</span>
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Raw JSON</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Structured JSON object representation of the Firestore database.
            </p>
          </div>
          <button
            onClick={() => exportTeamsToJSON(teams)}
            className="w-full py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold hover:bg-amber-100 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-600" /> Export JSON Objects
          </button>
        </GlassCard>
      </div>

      {/* DATASET SUMMARY */}
      <GlassCard variant="default" className="p-6 bg-white border-slate-200 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
          Available Datasets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
            <Users className="w-6 h-6 text-slate-700" />
            <div>
              <div className="font-bold text-slate-900">{teams.length} Teams Registered</div>
              <div className="text-[11px] text-slate-500">{participants.length} Total Members</div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-slate-700" />
            <div>
              <div className="font-bold text-slate-900">{collegeStats.length} Institutions</div>
              <div className="text-[11px] text-slate-500">Ranked by volume</div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
            <Eye className="w-6 h-6 text-slate-700" />
            <div>
              <div className="font-bold text-slate-900">{sessions.length} Visitor Sessions</div>
              <div className="text-[11px] text-slate-500">user_sessions collection</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
