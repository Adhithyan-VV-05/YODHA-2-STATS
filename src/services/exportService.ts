import type { Team } from '../types/team';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportTeamsToCSV(teams: Team[], filename = 'yodha_teams_export.csv') {
  const headers = ['Team ID', 'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'College', 'Track', 'Problem Statement', 'Google Drive Link', 'Members Count', 'Status', 'Created At'];
  const rows = teams.map(t => [
    t.id,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.leaderName.replace(/"/g, '""')}"`,
    t.leaderEmail,
    t.leaderPhone,
    `"${t.college.replace(/"/g, '""')}"`,
    t.track,
    `"${(t.problemStatementTitle || '').replace(/"/g, '""')}"`,
    `"${(t.driveLink || t.pptLink || '').replace(/"/g, '""')}"`,
    t.size,
    t.status,
    t.createdAt
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTeamsToExcel(teams: Team[], filename = 'yodha_teams_export.xlsx') {
  const data = teams.map(t => ({
    'Team ID': t.id,
    'Team Name': t.name,
    'Leader Name': t.leaderName,
    'Leader Email': t.leaderEmail,
    'Leader Phone': t.leaderPhone,
    'College': t.college,
    'Track': t.track,
    'Problem Statement': t.problemStatementTitle || 'N/A',
    'Google Drive Link': t.driveLink || t.pptLink || 'N/A',
    'Size': t.size,
    'Status': t.status,
    'Registration Date': t.createdAt,
    'GitHub Repo': t.githubRepo || 'N/A'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams');
  XLSX.writeFile(workbook, filename);
}

export function exportTeamsToJSON(teams: Team[], filename = 'yodha_teams_export.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(teams, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTeamPDF(team: Team) {
  const doc = new jsPDF();

  // Cyberpunk Header Banner
  doc.setFillColor(6, 8, 13);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(0, 243, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('YODHA COMMAND CENTER', 14, 18);

  doc.setTextColor(200, 200, 220);
  doc.setFontSize(10);
  doc.text('OFFICIAL TEAM DOSSIER & PARTICIPANT PROFILE', 14, 26);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 33);

  // Team Details Box
  doc.setTextColor(20, 20, 30);
  doc.setFontSize(14);
  doc.text(`TEAM: ${team.name} (${team.id})`, 14, 50);

  doc.setFontSize(10);
  doc.text(`Track: ${team.track}`, 14, 58);
  doc.text(`College: ${team.college}`, 14, 64);
  doc.text(`Status: ${team.status}`, 14, 70);
  doc.text(`Members: ${team.size}`, 14, 76);
  doc.text(`Leader Contact: ${team.leaderName} (${team.leaderEmail} | ${team.leaderPhone})`, 14, 82);
  doc.text(`Google Drive Link: ${team.driveLink || team.pptLink || 'N/A'}`, 14, 88);

  // Members Table
  const tableData = team.members.map(m => [
    m.role,
    m.name,
    m.email,
    m.phone,
    m.year,
    m.gender,
    m.githubUrl || 'N/A'
  ]);

  autoTable(doc, {
    startY: 96,
    head: [['Role', 'Name', 'Email', 'Phone', 'Year', 'Gender', 'GitHub']],
    body: tableData,
    headStyles: { fillColor: [13, 17, 26], textColor: [0, 243, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  doc.save(`${team.name.replace(/\s+/g, '_')}_Dossier.pdf`);
}
