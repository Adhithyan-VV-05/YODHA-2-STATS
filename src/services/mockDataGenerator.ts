import type { Team } from '../types/team';
import type { Participant } from '../types/participant';
import type { CollegeStats } from '../types/analytics';

/**
 * Extracts individual Participant records from a array of real Teams loaded from Firestore.
 */
export function extractParticipantsFromTeams(teams: Team[]): Participant[] {
  const participants: Participant[] = [];
  teams.forEach(team => {
    team.members.forEach(mbr => {
      participants.push({
        id: mbr.id,
        teamId: team.id,
        teamName: team.name,
        name: mbr.name,
        email: mbr.email,
        phone: mbr.phone,
        college: mbr.college || team.college,
        year: mbr.year || '3rd Year',
        gender: mbr.gender || 'Male',
        track: team.track,
        role: mbr.role,
        githubUrl: mbr.githubUrl,
        hasGithub: !!mbr.githubUrl,
        registeredAt: team.createdAt
      });
    });
  });
  return participants;
}

/**
 * Calculates college ranking and participant counts per college directly from real Teams loaded from Firestore.
 */
export function generateCollegeStats(teams: Team[]): CollegeStats[] {
  if (!teams || teams.length === 0) return [];

  const map: Record<string, { count: number; members: number }> = {};
  teams.forEach(t => {
    const colName = t.college || 'Unspecified Institution';
    if (!map[colName]) {
      map[colName] = { count: 0, members: 0 };
    }
    map[colName].count += 1;
    map[colName].members += (t.members?.length || t.size || 1);
  });

  const total = teams.length;
  return Object.entries(map)
    .map(([collegeName, val]) => ({
      collegeName,
      totalTeams: val.count,
      totalParticipants: val.members,
      avgTeamSize: Number((val.members / val.count).toFixed(1)),
      percentage: Number(((val.count / total) * 100).toFixed(1))
    }))
    .sort((a, b) => b.totalParticipants - a.totalParticipants);
}
