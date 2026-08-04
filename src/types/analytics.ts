export interface OverviewMetrics {
  totalVisits: number;
  totalSessions: number;
  totalTeams: number;
  totalParticipants: number;
  todayVisits: number;
  todayRegistrations: number;
  registrationsThisWeek: number;
  healthcareTeams: number;
  environmentTeams: number;
  avgTeamSize: number;
  largestTeamSize: number;
  avgSessionDurationSeconds: number;
  avgActiveTimeSeconds: number;
  avgInactiveTimeSeconds: number;
  currentActiveSessions: number;
  activeUsersOnline: number;
  activeDesktopUsers: number;
  activeMobileUsers: number;
  currentlyViewing: number;
  conversionRate: number;
  registrationGrowthPercent: number;
  visitsGrowthPercent: number;
  totalReferralCodes?: number;
  totalSuccessfulReferrals?: number;
  lastUpdatedIST: string;
}

export interface CollegeStats {
  collegeName: string;
  totalTeams: number;
  totalParticipants: number;
  avgTeamSize: number;
  percentage: number;
}

export interface TrackStats {
  trackName: string;
  teamCount: number;
  participantCount: number;
  percentage: number;
  growthPercent: number;
}

export interface HourlyTraffic {
  hour: string;
  visits: number;
  registrations: number;
  activeSessions: number;
}

export interface DailyRegistrationTrend {
  date: string;
  teams: number;
  participants: number;
  healthcare: number;
  environment: number;
}

export interface QuickInsight {
  id: string;
  title: string;
  summary: string;
  category: 'Track' | 'Traffic' | 'Device' | 'College' | 'Registration';
  trend?: 'up' | 'down' | 'neutral';
}
