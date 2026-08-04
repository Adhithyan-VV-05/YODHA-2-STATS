import type { Team } from '../types/team';
import type { OverviewMetrics, QuickInsight } from '../types/analytics';

export function generateAutomatedAIInsights(teams: Team[]): QuickInsight[] {
  if (!teams) return [];
  return [
    {
      id: 'ins-1',
      category: 'Track',
      title: 'Healthcare Track Leading',
      summary: `${teams.filter(t => t.track === 'Healthcare').length} teams registered in Healthcare track.`,
      trend: 'up'
    }
  ];
}

export function generateAICommanderBriefing(teams: Team[], metrics: OverviewMetrics): {
  title: string;
  lines: string[];
  statusMessage: string;
  timestamp: string;
} {
  return {
    title: 'MISSION STATUS BRIEFING',
    lines: [
      `${teams.length} live team(s) currently registered in YODHA-2 database.`,
      `Database telemetry records ${metrics.totalVisits} total site visits.`
    ],
    statusMessage: 'YODHA-2 FIRESTORE REALTIME SYNC ACTIVE',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
  };
}
