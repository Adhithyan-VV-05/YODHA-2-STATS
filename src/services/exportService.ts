import type { Team } from '../types/team';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportTeamsToCSV(teams: Team[], filename = 'yodha_complete_teams_export.csv') {
  const headers = [
    'S.No',
    'Team ID',
    'Team Name',
    'Track',
    'College',
    'Status',
    'Team Size',
    'Problem Statement',
    'Google Drive / PPT Link',
    'Warrior Referral Code',
    'Used Referral Code',
    'Registered Date (IST)',
    'Leader Name',
    'Leader Email',
    'Leader Phone',
    'Leader Year',
    'Leader Gender',
    'Leader GitHub',
    'Member 1 Name',
    'Member 1 Email',
    'Member 1 Phone',
    'Member 1 College',
    'Member 1 Year',
    'Member 1 Gender',
    'Member 1 GitHub',
    'Member 2 Name',
    'Member 2 Email',
    'Member 2 Phone',
    'Member 2 College',
    'Member 2 Year',
    'Member 2 Gender',
    'Member 2 GitHub',
    'Member 3 Name',
    'Member 3 Email',
    'Member 3 Phone',
    'Member 3 College',
    'Member 3 Year',
    'Member 3 Gender',
    'Member 3 GitHub',
    'Member 4 Name',
    'Member 4 Email',
    'Member 4 Phone',
    'Member 4 College',
    'Member 4 Year',
    'Member 4 Gender',
    'Member 4 GitHub',
    'Project Description'
  ];

  const rows = teams.map((t, idx) => {
    const leader = t.members.find(m => m.role === 'Leader') || t.members[0] || {} as any;
    const otherMembers = t.members.filter(m => m.role !== 'Leader');

    const m1 = otherMembers[0] || {} as any;
    const m2 = otherMembers[1] || {} as any;
    const m3 = otherMembers[2] || {} as any;
    const m4 = otherMembers[3] || {} as any;

    const escapeCsv = (str?: string | number) => `"${String(str || '').replace(/"/g, '""')}"`;

    return [
      idx + 1,
      escapeCsv(t.id),
      escapeCsv(t.name),
      escapeCsv(t.track),
      escapeCsv(t.college),
      escapeCsv(t.status),
      t.size || t.members.length,
      escapeCsv(t.problemStatementTitle || 'N/A'),
      escapeCsv(t.driveLink || t.pptLink || 'N/A'),
      escapeCsv(t.warriorReferralCode || 'N/A'),
      escapeCsv(t.usedReferralCode || 'N/A'),
      escapeCsv(t.createdAt),
      // Leader
      escapeCsv(leader.name || t.leaderName),
      escapeCsv(leader.email || t.leaderEmail),
      escapeCsv(leader.phone || t.leaderPhone),
      escapeCsv(leader.year || '3rd Year'),
      escapeCsv(leader.gender || 'Male'),
      escapeCsv(leader.githubUrl || ''),
      // Member 1
      escapeCsv(m1.name || ''),
      escapeCsv(m1.email || ''),
      escapeCsv(m1.phone || ''),
      escapeCsv(m1.college || ''),
      escapeCsv(m1.year || ''),
      escapeCsv(m1.gender || ''),
      escapeCsv(m1.githubUrl || ''),
      // Member 2
      escapeCsv(m2.name || ''),
      escapeCsv(m2.email || ''),
      escapeCsv(m2.phone || ''),
      escapeCsv(m2.college || ''),
      escapeCsv(m2.year || ''),
      escapeCsv(m2.gender || ''),
      escapeCsv(m2.githubUrl || ''),
      // Member 3
      escapeCsv(m3.name || ''),
      escapeCsv(m3.email || ''),
      escapeCsv(m3.phone || ''),
      escapeCsv(m3.college || ''),
      escapeCsv(m3.year || ''),
      escapeCsv(m3.gender || ''),
      escapeCsv(m3.githubUrl || ''),
      // Member 4
      escapeCsv(m4.name || ''),
      escapeCsv(m4.email || ''),
      escapeCsv(m4.phone || ''),
      escapeCsv(m4.college || ''),
      escapeCsv(m4.year || ''),
      escapeCsv(m4.gender || ''),
      escapeCsv(m4.githubUrl || ''),
      escapeCsv(t.projectDescription || '')
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTeamsToExcel(teams: Team[], filename = 'yodha_complete_teams_export.xlsx') {
  // Sheet 1: Teams Overview with All Members
  const teamsData = teams.map((t, idx) => {
    const leader = t.members.find(m => m.role === 'Leader') || t.members[0] || {} as any;
    const otherMembers = t.members.filter(m => m.role !== 'Leader');

    const m1 = otherMembers[0] || {} as any;
    const m2 = otherMembers[1] || {} as any;
    const m3 = otherMembers[2] || {} as any;
    const m4 = otherMembers[3] || {} as any;

    return {
      'S.No': idx + 1,
      'Team ID': t.id,
      'Team Name': t.name,
      'Track': t.track,
      'College': t.college,
      'Status': t.status,
      'Members Count': t.size || t.members.length,
      'Problem Statement': t.problemStatementTitle || 'N/A',
      'Drive / PPT Link': t.driveLink || t.pptLink || 'N/A',
      'Warrior Referral Code': t.warriorReferralCode || 'N/A',
      'Used Referral Code': t.usedReferralCode || 'N/A',
      'Registration Date': t.createdAt,

      // Leader Details
      'Leader Name': leader.name || t.leaderName,
      'Leader Email': leader.email || t.leaderEmail,
      'Leader Phone': leader.phone || t.leaderPhone,
      'Leader Year': leader.year || '3rd Year',
      'Leader Gender': leader.gender || 'Male',
      'Leader GitHub': leader.githubUrl || 'N/A',

      // Member 1
      'Member 1 Name': m1.name || '',
      'Member 1 Email': m1.email || '',
      'Member 1 Phone': m1.phone || '',
      'Member 1 College': m1.college || '',
      'Member 1 Year': m1.year || '',
      'Member 1 Gender': m1.gender || '',
      'Member 1 GitHub': m1.githubUrl || '',

      // Member 2
      'Member 2 Name': m2.name || '',
      'Member 2 Email': m2.email || '',
      'Member 2 Phone': m2.phone || '',
      'Member 2 College': m2.college || '',
      'Member 2 Year': m2.year || '',
      'Member 2 Gender': m2.gender || '',
      'Member 2 GitHub': m2.githubUrl || '',

      // Member 3
      'Member 3 Name': m3.name || '',
      'Member 3 Email': m3.email || '',
      'Member 3 Phone': m3.phone || '',
      'Member 3 College': m3.college || '',
      'Member 3 Year': m3.year || '',
      'Member 3 Gender': m3.gender || '',
      'Member 3 GitHub': m3.githubUrl || '',

      // Member 4
      'Member 4 Name': m4.name || '',
      'Member 4 Email': m4.email || '',
      'Member 4 Phone': m4.phone || '',
      'Member 4 College': m4.college || '',
      'Member 4 Year': m4.year || '',
      'Member 4 Gender': m4.gender || '',
      'Member 4 GitHub': m4.githubUrl || '',
      'Project Description': t.projectDescription || ''
    };
  });

  // Sheet 2: Flattened All Participants Roster
  const participantsData: any[] = [];
  let pIdx = 1;

  teams.forEach(t => {
    t.members.forEach(m => {
      participantsData.push({
        'S.No': pIdx++,
        'Participant Name': m.name,
        'Role': m.role,
        'Email': m.email,
        'Phone': m.phone,
        'College': m.college || t.college,
        'Year of Study': m.year,
        'Gender': m.gender,
        'Team ID': t.id,
        'Team Name': t.name,
        'Track': t.track,
        'GitHub': m.githubUrl || 'N/A',
        'Registered Date': t.createdAt
      });
    });
  });

  const workbook = XLSX.utils.book_new();
  const teamsSheet = XLSX.utils.json_to_sheet(teamsData);
  const participantsSheet = XLSX.utils.json_to_sheet(participantsData);

  XLSX.utils.book_append_sheet(workbook, teamsSheet, 'Teams Roster');
  XLSX.utils.book_append_sheet(workbook, participantsSheet, 'All Participants');
  XLSX.writeFile(workbook, filename);
}

export function exportTeamsToJSON(teams: Team[], filename = 'yodha_complete_teams_export.json') {
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

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('YODHA 2.0 COMMAND CENTER', 14, 18);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(10);
  doc.text('OFFICIAL TEAM DOSSIER & PARTICIPANT PROFILE', 14, 26);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 33);

  // Team Details Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text(`TEAM: ${team.name} (${team.id})`, 14, 50);

  doc.setFontSize(10);
  doc.text(`Track: ${team.track}`, 14, 58);
  doc.text(`College: ${team.college}`, 14, 64);
  doc.text(`Status: ${team.status}`, 14, 70);
  doc.text(`Members: ${team.size || team.members.length}`, 14, 76);
  doc.text(`Leader Contact: ${team.leaderName} (${team.leaderEmail} | ${team.leaderPhone})`, 14, 82);
  doc.text(`Google Drive / PPT Link: ${team.driveLink || team.pptLink || 'N/A'}`, 14, 88);
  if (team.warriorReferralCode) {
    doc.text(`Referral Code: ${team.warriorReferralCode}`, 14, 94);
  }

  // Members Table
  const tableData = team.members.map(m => [
    m.role,
    m.name,
    m.email,
    m.phone,
    m.college || team.college,
    m.year,
    m.gender,
    m.githubUrl || 'N/A'
  ]);

  autoTable(doc, {
    startY: team.warriorReferralCode ? 100 : 96,
    head: [['Role', 'Name', 'Email', 'Phone', 'College', 'Year', 'Gender', 'GitHub']],
    body: tableData,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`${team.name.replace(/\s+/g, '_')}_Dossier.pdf`);
}

