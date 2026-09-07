import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Team, SelectedTeam } from '../types/team';
import type { Participant } from '../types/participant';
import type { VisitorSession } from '../types/session';
import type { ActivityEvent } from '../types/activity';
import type { OverviewMetrics, CollegeStats, QuickInsight } from '../types/analytics';
import {
  extractParticipantsFromTeams,
  generateCollegeStats
} from '../services/mockDataGenerator';
import { initFirebaseApp } from '../services/firebase';
import {
  subscribeToRegistrations,
  subscribeToUserSessions,
  subscribeToSiteAnalytics,
  subscribeToAdminPasscode,
  subscribeToReferralRooms,
  subscribeToSelectedTeams,
  updateFirestoreTeam,
  updateFirestoreTeamStatus,
  deleteFirestoreTeam,
  updateFirestoreAdminPasscode,
  toggleFirestoreTeamShortlist,
  updateTotalVisitsInFirestore,
  bulkDeleteFirestoreTeams,
  bulkDeleteFirestoreSelectedTeams,
  bulkDeleteFirestoreSessions
} from '../services/firestoreService';
import type { ReferralRoom } from '../services/firestoreService';
import type { Firestore } from 'firebase/firestore';
import { useToast } from './ToastContext';
import { useAdminAuth } from './AdminAuthContext';
import { formatISTDateTime, formatDuration } from '../utils/formatters';

interface CommandCenterContextType {
  teams: Team[];
  selectedTeams: SelectedTeam[];
  participants: Participant[];
  sessions: VisitorSession[];
  activities: ActivityEvent[];
  referralRooms: ReferralRoom[];
  metrics: OverviewMetrics;
  collegeStats: CollegeStats[];
  quickInsights: QuickInsight[];
  isMockMode: boolean;
  setMockMode: (val: boolean) => void;
  isFirebaseConnected: boolean;
  firestoreDb: Firestore | null;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  selectedParticipant: Participant | null;
  setSelectedParticipant: (p: Participant | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  updateTeamStatus: (teamId: string, status: Team['status']) => Promise<void>;
  toggleShortlistTeam: (team: Team, isShortlisted: boolean) => Promise<void>;
  bulkDeleteTeams: (teamIds: string[]) => Promise<void>;
  bulkDeleteSelectedTeams: (selectedIds: string[]) => Promise<void>;
  bulkDeleteSessions: (sessionIds: string[]) => Promise<void>;
  updateTotalVisitorsCount: (count: number) => Promise<void>;
  saveAdminPasscodeToFirestore: (code: string) => Promise<void>;
}

const CommandCenterContext = createContext<CommandCenterContextType | undefined>(undefined);

export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const { setAdminPasscode } = useAdminAuth();

  const [isMockMode, setMockMode] = useState<boolean>(false);
  const [firestoreDb, setFirestoreDb] = useState<Firestore | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [referralRooms, setReferralRooms] = useState<ReferralRoom[]>([]);
  const [siteAnalyticsDoc, setSiteAnalyticsDoc] = useState<any>(null);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    const { db } = initFirebaseApp();
    if (db) {
      setFirestoreDb(db);
      setIsFirebaseConnected(true);
      setMockMode(false);
      showToast('Firestore Realtime Connected', 'Live YODHA-2 collection listeners active', 'success');

      const unsubReg = subscribeToRegistrations(
        db,
        (liveTeams) => {
          setTeams(liveTeams);

          const regActivities: ActivityEvent[] = liveTeams.map(t => ({
            id: `act-reg-${t.id}`,
            type: 'team_registered',
            title: 'New Team Registered',
            description: `${t.name} (${t.track}) registered by ${t.leaderName} from ${t.college}`,
            timestamp: t.createdAt,
            category: 'Registration',
            severity: 'success'
          }));

          setActivities(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const newEntries = regActivities.filter(a => !existingIds.has(a.id));
            return [...newEntries, ...prev].slice(0, 50);
          });
        },
        (err) => {
          showToast('Firestore Sync Notice', err.message || 'Connecting to Firestore...', 'warning');
        }
      );

      const unsubSelected = subscribeToSelectedTeams(
        db,
        (liveSelected) => {
          setSelectedTeams(liveSelected);
        },
        () => {}
      );

      const unsubSess = subscribeToUserSessions(
        db,
        (liveSessions) => {
          setSessions(liveSessions);
        },
        () => {}
      );

      const unsubStats = subscribeToSiteAnalytics(
        db,
        (statsData) => {
          setSiteAnalyticsDoc(statsData);
        },
        () => {}
      );

      const unsubPasscode = subscribeToAdminPasscode(
        db,
        (passcode) => {
          setAdminPasscode(passcode);
        },
        () => {}
      );

      const unsubReferrals = subscribeToReferralRooms(
        db,
        (fetchedRooms) => {
          setReferralRooms(fetchedRooms);
        },
        () => {}
      );

      return () => {
        unsubReg();
        unsubSelected();
        unsubSess();
        unsubStats();
        unsubPasscode();
        unsubReferrals();
      };
    }
  }, []);

  const participants = extractParticipantsFromTeams(teams);
  const collegeStats = generateCollegeStats(teams);

  // Compute Metrics strictly from live Firestore data
  const totalVisits = siteAnalyticsDoc?.totalVisits ?? siteAnalyticsDoc?.totalVisitsCount ?? 1500;
  const totalSessions = sessions.length;
  const totalTeams = teams.length;
  const totalParticipants = participants.length;

  const totalReferralCodes = siteAnalyticsDoc?.totalReferralCodes || referralRooms.length;
  const totalSuccessfulReferrals = siteAnalyticsDoc?.totalSuccessfulReferrals || referralRooms.reduce((acc, r) => acc + (r.totalReferrals || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const nowMs = Date.now();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;

  const todayVisits = sessions.filter(s => s.startTime && s.startTime.startsWith(todayStr)).length;
  const todayRegistrations = teams.filter(t => t.createdAt && t.createdAt.startsWith(todayStr)).length;
  const registrationsThisWeek = teams.filter(t => new Date(t.createdAt).getTime() >= sevenDaysAgoMs).length;

  const healthcareTeams = teams.filter(t => t.track === 'Healthcare').length;
  const environmentTeams = teams.filter(t => t.track === 'Environment').length;

  const avgTeamSize = teams.length > 0 ? Number((participants.length / teams.length).toFixed(1)) : 0;
  const largestTeamSize = teams.length > 0 ? Math.max(...teams.map(t => t.members.length)) : 0;

  const avgSessionDurationSeconds = 0;
  const avgActiveTimeSeconds = 0;
  const avgInactiveTimeSeconds = 0;

  const activeUsersOnline = sessions.filter(s => s.isOnline).length;
  const activeDesktopUsers = sessions.filter(s => s.isOnline && s.device === 'Desktop').length;
  const activeMobileUsers = sessions.filter(s => s.isOnline && s.device === 'Mobile').length;
  const currentlyViewing = sessions.filter(s => s.isOnline && (s.tabStatus === 'Focused' || s.tabStatus === 'Online')).length;

  const conversionRate = sessions.length > 0 ? Number(((teams.length / sessions.length) * 100).toFixed(1)) : 0;

  const computedMetrics: OverviewMetrics = {
    totalVisits,
    totalSessions,
    totalTeams,
    totalParticipants,
    todayVisits,
    todayRegistrations,
    registrationsThisWeek,
    healthcareTeams,
    environmentTeams,
    avgTeamSize,
    largestTeamSize,
    avgSessionDurationSeconds,
    avgActiveTimeSeconds,
    avgInactiveTimeSeconds,
    currentActiveSessions: activeUsersOnline,
    activeUsersOnline,
    activeDesktopUsers,
    activeMobileUsers,
    currentlyViewing,
    conversionRate,
    registrationGrowthPercent: 0,
    visitsGrowthPercent: 0,
    totalReferralCodes,
    totalSuccessfulReferrals,
    lastUpdatedIST: formatISTDateTime(new Date())
  };

  // Automated Quick Insights Generation
  const quickInsights: QuickInsight[] = [];

  const trackCounts: Record<string, number> = {};
  teams.forEach(t => { trackCounts[t.track] = (trackCounts[t.track] || 0) + 1; });
  const sortedTracks = Object.entries(trackCounts).sort((a, b) => b[1] - a[1]);
  if (sortedTracks.length > 0) {
    quickInsights.push({
      id: 'qi-track',
      title: 'Popular Track Lead',
      summary: `${sortedTracks[0][0]} is currently the most popular track with ${sortedTracks[0][1]} registered team(s).`,
      category: 'Track',
      trend: 'up'
    });
  }

  if (collegeStats.length > 0) {
    quickInsights.push({
      id: 'qi-college',
      title: 'Top Institution Leader',
      summary: `Most participants are registered from ${collegeStats[0].collegeName} (${collegeStats[0].totalParticipants} participants).`,
      category: 'College',
      trend: 'up'
    });
  }

  const saveAdminPasscodeToFirestore = async (code: string) => {
    if (firestoreDb) {
      await updateFirestoreAdminPasscode(firestoreDb, code);
    }
  };

  const addTeam = (newTeam: Team) => {
    setTeams(prev => [newTeam, ...prev]);
    showToast('Team Added', `${newTeam.name} added to roster`, 'success');
  };

  const updateTeam = async (updatedTeam: Team) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    if (firestoreDb) {
      try {
        await updateFirestoreTeam(firestoreDb, updatedTeam);
        showToast('Firestore Updated', `Response for ${updatedTeam.name} updated in Firestore`, 'success');
      } catch (err: any) {
        showToast('Firestore Error', err.message || 'Failed to update Firestore', 'alert');
        throw err;
      }
    } else {
      showToast('Local Update Only', `Updated local data for ${updatedTeam.name}`, 'info');
    }
  };

  const deleteTeam = async (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (firestoreDb) {
      try {
        await deleteFirestoreTeam(firestoreDb, teamId);
        showToast('Firestore Deleted', `Response ${teamId} removed from Firestore`, 'warning');
      } catch (err: any) {
        showToast('Firestore Error', err.message || 'Failed to delete from Firestore', 'alert');
        throw err;
      }
    } else {
      showToast('Local Remove', `Team ${teamId} removed locally`, 'warning');
    }
  };

  const updateTeamStatus = async (teamId: string, status: Team['status']) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status } : t));
    if (firestoreDb) {
      try {
        await updateFirestoreTeamStatus(firestoreDb, teamId, status);
        showToast('Status Updated', `Team status set to ${status} in Firestore`, 'info');
      } catch (err: any) {
        showToast('Firestore Error', err.message || 'Failed to update status', 'alert');
        throw err;
      }
    } else {
      showToast('Status Updated', `Status changed to ${status}`, 'info');
    }
  };

  const toggleShortlistTeam = async (team: Team, isShortlisted: boolean) => {
    const nextStatus: Team['status'] = isShortlisted ? 'Shortlisted' : 'Verified';
    setTeams(prev => prev.map(t => t.id === team.id ? { ...t, status: nextStatus } : t));
    if (firestoreDb) {
      try {
        await toggleFirestoreTeamShortlist(firestoreDb, team, isShortlisted);
        showToast(
          isShortlisted ? 'Team Shortlisted' : 'Shortlist Cancelled',
          isShortlisted
            ? `Team "${team.name}" shortlisted and synced to Selected Teams`
            : `Team "${team.name}" status reverted to Verified`,
          isShortlisted ? 'success' : 'info'
        );
      } catch (err: any) {
        showToast('Shortlist Sync Error', err.message || 'Failed to sync shortlist in Firestore', 'alert');
      }
    }
  };

  const bulkDeleteTeams = async (teamIds: string[]) => {
    setTeams(prev => prev.filter(t => !teamIds.includes(t.id)));
    if (firestoreDb) {
      try {
        await bulkDeleteFirestoreTeams(firestoreDb, teamIds);
        showToast('Bulk Delete Successful', `Deleted ${teamIds.length} team record(s) from Firestore`, 'warning');
      } catch (err: any) {
        showToast('Bulk Delete Error', err.message || 'Failed to delete records', 'alert');
      }
    }
  };

  const bulkDeleteSelectedTeams = async (selectedIds: string[]) => {
    setSelectedTeams(prev => prev.filter(st => !selectedIds.includes(st.id) && !selectedIds.includes(st.uniqueTeamId)));
    if (firestoreDb) {
      try {
        await bulkDeleteFirestoreSelectedTeams(firestoreDb, selectedIds);
        showToast('Bulk Delete Successful', `Deleted ${selectedIds.length} selected team record(s)`, 'warning');
      } catch (err: any) {
        showToast('Bulk Delete Error', err.message || 'Failed to delete selected records', 'alert');
      }
    }
  };

  const bulkDeleteSessions = async (sessionIds: string[]) => {
    setSessions(prev => prev.filter(s => !sessionIds.includes(s.id)));
    if (firestoreDb) {
      try {
        await bulkDeleteFirestoreSessions(firestoreDb, sessionIds);
        showToast('Bulk Delete Successful', `Deleted ${sessionIds.length} session record(s)`, 'warning');
      } catch (err: any) {
        showToast('Bulk Delete Error', err.message || 'Failed to delete sessions', 'alert');
      }
    }
  };

  const updateTotalVisitorsCount = async (count: number) => {
    setSiteAnalyticsDoc(prev => ({ ...(prev || {}), totalVisits: count }));
    if (firestoreDb) {
      try {
        await updateTotalVisitsInFirestore(firestoreDb, count);
        showToast('Total Visitors Updated', `Updated Total Visitors count to ${count} in Firestore`, 'success');
      } catch (err: any) {
        showToast('Update Error', err.message || 'Failed to update total visitors count', 'alert');
      }
    }
  };

  return (
    <CommandCenterContext.Provider
      value={{
        teams,
        selectedTeams,
        participants,
        sessions,
        activities,
        referralRooms,
        metrics: computedMetrics,
        collegeStats,
        quickInsights,
        isMockMode,
        setMockMode,
        isFirebaseConnected,
        firestoreDb,
        selectedTeam,
        setSelectedTeam,
        selectedParticipant,
        setSelectedParticipant,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        addTeam,
        updateTeam,
        deleteTeam,
        updateTeamStatus,
        toggleShortlistTeam,
        bulkDeleteTeams,
        bulkDeleteSelectedTeams,
        bulkDeleteSessions,
        updateTotalVisitorsCount,
        saveAdminPasscodeToFirestore
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const context = useContext(CommandCenterContext);
  if (!context) {
    throw new Error('useCommandCenter must be used within a CommandCenterProvider');
  }
  return context;
}
