import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { FileText, Download, Calendar, ShieldCheck } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsPage: React.FC = () => {
  const { teams, metrics, collegeStats } = useCommandCenter();

  const generatePDFReport = (reportType: string) => {
    const doc = new jsPDF();

    // Dark Header
    doc.setFillColor(6, 8, 13);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(0, 243, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('YODHA COMMAND CENTER', 14, 20);

    doc.setTextColor(200, 200, 220);
    doc.setFontSize(11);
    doc.text(`OFFICIAL EXECUTIVE BRIEF: ${reportType.toUpperCase()}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()} | Security Level: ALPHA-1`, 14, 36);

    // Summary Section
    doc.setTextColor(20, 20, 30);
    doc.setFontSize(14);
    doc.text('EXECUTIVE SUMMARY & OPERATIONAL METRICS', 14, 55);

    doc.setFontSize(10);
    doc.text(`Total Registered Teams: ${teams.length} / 120 (Target Completion: 70%)`, 14, 63);
    doc.text(`Total Participants Scouted: ${metrics.totalParticipants}`, 14, 69);
    doc.text(`Healthcare Track Teams: ${metrics.healthcareTeams}`, 14, 75);
    doc.text(`Environment Track Teams: ${metrics.environmentTeams}`, 14, 81);
    doc.text(`Website Visitors Total: ${metrics.totalVisits.toLocaleString()} (${metrics.todayVisits} Today)`, 14, 87);

    // Colleges Table
    const tableData = collegeStats.slice(0, 8).map((c, i) => [
      `#${i + 1}`,
      c.collegeName,
      c.totalTeams,
      c.totalParticipants,
      `${c.percentage}%`
    ]);

    autoTable(doc, {
      startY: 95,
      head: [['Rank', 'College / University', 'Teams', 'Participants', 'Share']],
      body: tableData,
      headStyles: { fillColor: [13, 17, 26], textColor: [0, 243, 255] }
    });

    doc.save(`YODHA_${reportType.replace(/\s+/g, '_')}_Report.pdf`);
  };

  const reportsList = [
    { title: 'Daily Mission Brief', type: 'Daily Report', desc: 'Summary of past 24 hours registrations, traffic spikes & telemetry' },
    { title: 'Weekly Operational Report', type: 'Weekly Report', desc: '7-day velocity curves, college leaderboard & track distribution' },
    { title: 'Full Registration Dossier', type: 'Registration Report', desc: 'Complete breakdown of 84 teams and 302 scouted participants' },
    { title: 'Visitor Intelligence & Geo Report', type: 'Visitor Report', desc: 'Device, browser, OS distribution & hourly traffic heatmaps' }
  ];

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" /> EXECUTIVE REPORTS & BRIEFINGS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          GENERATE AND DOWNLOAD FORMATTED PDF BRIEFINGS FOR ORGANIZERS & STAKEHOLDERS
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((r, idx) => (
          <GlassCard key={idx} variant="glow" className="p-5 flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest">{r.type}</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{r.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{r.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Updated Realtime
              </span>
              <button
                onClick={() => generatePDFReport(r.type)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
