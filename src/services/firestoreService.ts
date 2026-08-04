import { collection, doc, onSnapshot, query, limit, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Team, TeamMember, TrackType } from '../types/team';
import type { VisitorSession, DeviceType, BrowserType, OsType, TabStatus } from '../types/session';

function mapTrackName(rawTrack: string): TrackType {
  if (!rawTrack) return 'Healthcare';
  const lower = rawTrack.toLowerCase();
  if (lower.includes('health')) return 'Healthcare';
  if (lower.includes('environ') || lower.includes('eco')) return 'Environment';
  if (lower.includes('ai') || lower.includes('robot')) return 'AI & Robotics';
  if (lower.includes('cyber') || lower.includes('sec')) return 'Cybersecurity';
  return 'Open Hardware';
}

function parseBrowserFromUA(ua?: string): BrowserType {
  if (!ua) return 'Chrome';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Brave')) return 'Brave';
  return 'Chrome';
}

function parseOsFromUA(ua?: string): OsType {
  if (!ua) return 'Windows';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return 'Mac';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Windows';
}

export function subscribeToRegistrations(
  db: Firestore, 
  onData: (teams: Team[]) => void, 
  onError: (err: any) => void
) {
  try {
    const q = query(collection(db, 'registrations'));
    return onSnapshot(q, (snapshot) => {
      const teams: Team[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();

        const leaderObj = d.leader || {};
        const leaderName = leaderObj.fullName || d.leaderName || d.teamName || 'Leader';
        const leaderEmail = leaderObj.email || d.leaderEmail || '';
        const leaderPhone = leaderObj.phone || d.leaderPhone || '';
        const college = leaderObj.organization || d.college || 'N/A';
        const year = leaderObj.yearOfStudy || d.year || '3rd Year';
        const gender = leaderObj.gender || 'Male';
        const githubUrl = leaderObj.githubUrl || '';

        const leaderMember: TeamMember = {
          id: `mbr-${docSnap.id}-leader`,
          name: leaderName,
          email: leaderEmail,
          phone: leaderPhone,
          college,
          year,
          gender,
          githubUrl: githubUrl || undefined,
          role: 'Leader'
        };

        const otherMembers: TeamMember[] = Array.isArray(d.members)
          ? d.members.map((m: any, idx: number) => ({
              id: `mbr-${docSnap.id}-${idx}`,
              name: m.fullName || m.name || `Member ${idx + 1}`,
              email: m.email || '',
              phone: m.phone || '',
              college: m.organization || college,
              year: m.yearOfStudy || year || '3rd Year',
              gender: m.gender || 'Male',
              githubUrl: m.githubUrl || undefined,
              role: 'Member'
            }))
          : [];

        const allMembers = [leaderMember, ...otherMembers];

        let createdAt = new Date().toISOString();
        if (d.submittedAt) {
          createdAt = d.submittedAt;
        } else if (d.createdAt && d.createdAt.seconds) {
          createdAt = new Date(d.createdAt.seconds * 1000).toISOString();
        }

        teams.push({
          id: docSnap.id,
          name: d.teamName || `Team-${docSnap.id.substring(0, 5)}`,
          leaderName,
          leaderEmail,
          leaderPhone,
          college,
          track: mapTrackName(d.track),
          members: allMembers,
          size: d.teamSize || allMembers.length,
          createdAt,
          status: d.status || 'Verified',
          projectDescription: d.projectDescription || undefined
        });
      });
      onData(teams);
    }, onError);
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeToUserSessions(
  db: Firestore, 
  onData: (sessions: VisitorSession[]) => void, 
  onError: (err: any) => void
) {
  try {
    const q = query(collection(db, 'user_sessions'), limit(150));
    return onSnapshot(q, (snapshot) => {
      const sessions: VisitorSession[] = [];
      const now = Date.now();

      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        let lastActiveMs = now;
        if (d.lastActive && d.lastActive.seconds) {
          lastActiveMs = d.lastActive.seconds * 1000;
        } else if (d.createdAt && d.createdAt.seconds) {
          lastActiveMs = d.createdAt.seconds * 1000;
        }

        const durationSeconds = d.durationSeconds || 180;
        const activeTimeSeconds = d.activeTimeSeconds || Math.round(durationSeconds * 0.85);
        const inactiveTimeSeconds = d.inactiveTimeSeconds || (durationSeconds - activeTimeSeconds);

        const isOnline = (now - lastActiveMs) < 5 * 60 * 1000;
        const rawTabStatus = d.tabStatus || (isOnline ? 'Focused' : 'Offline');

        const tabStatus: TabStatus = (
          ['Online', 'Focused', 'Background', 'Offline'].includes(rawTabStatus)
            ? rawTabStatus
            : isOnline ? 'Focused' : 'Offline'
        ) as TabStatus;

        const device = (d.deviceType as DeviceType) || 'Desktop';
        const browser = parseBrowserFromUA(d.userAgent);
        const os = parseOsFromUA(d.userAgent);

        const startTime = d.startTime || new Date(lastActiveMs - durationSeconds * 1000).toISOString();
        const endTime = d.endTime || (isOnline ? undefined : new Date(lastActiveMs).toISOString());

        sessions.push({
          id: docSnap.id,
          ipHash: d.ipHash || `103.24.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`,
          city: d.city || 'Visitor Location',
          country: d.country || 'India',
          device,
          browser,
          os,
          screenResolution: d.screenResolution || '1920x1080',
          durationSeconds,
          activeTimeSeconds,
          inactiveTimeSeconds,
          pagesViewed: d.pagesViewed || 1,
          entryPage: d.entryPage || '/',
          isBounce: durationSeconds < 10,
          startTime,
          endTime,
          lastActive: new Date(lastActiveMs).toISOString(),
          isOnline,
          tabStatus
        });
      });

      onData(sessions);
    }, onError);
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeToSiteAnalytics(
  db: Firestore,
  onData: (stats: any) => void,
  onError: (err: any) => void
) {
  try {
    const docRef = doc(db, 'stats', 'site_analytics');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data());
      }
    }, onError);
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeToAdminPasscode(
  db: Firestore,
  onPasscode: (code: string) => void,
  onError?: (err: any) => void
) {
  try {
    const docRef = doc(db, 'stats', 'admin_config');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d.passcode) {
          onPasscode(d.passcode);
        }
      } else {
        // Auto-initialize default YODHA2026 in Firestore if missing
        setDoc(docRef, { passcode: 'YODHA2026', updatedAt: new Date().toISOString() }).catch(() => {});
        onPasscode('YODHA2026');
      }
    }, (err) => {
      if (onError) onError(err);
      onPasscode('YODHA2026');
    });
  } catch (err) {
    if (onError) onError(err);
    onPasscode('YODHA2026');
    return () => {};
  }
}

export async function updateFirestoreAdminPasscode(db: Firestore, newPasscode: string) {
  const docRef = doc(db, 'stats', 'admin_config');
  await setDoc(docRef, { passcode: newPasscode, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function addFirestoreTeam(db: Firestore, team: Team) {
  await setDoc(doc(db, 'registrations', team.id), team);
}

export async function updateFirestoreTeam(db: Firestore, team: Team) {
  const leaderMember = team.members.find(m => m.role === 'Leader') || team.members[0];
  const regularMembers = team.members.filter(m => m.role !== 'Leader');

  const updatePayload = {
    teamName: team.name,
    track: team.track,
    college: team.college,
    leaderName: team.leaderName,
    leaderEmail: team.leaderEmail,
    leaderPhone: team.leaderPhone,
    teamSize: team.members.length,
    status: team.status,
    projectDescription: team.projectDescription || '',
    leader: {
      fullName: leaderMember?.name || team.leaderName,
      email: leaderMember?.email || team.leaderEmail,
      phone: leaderMember?.phone || team.leaderPhone,
      organization: team.college,
      yearOfStudy: leaderMember?.year || '3rd Year',
      gender: leaderMember?.gender || 'Male',
      githubUrl: leaderMember?.githubUrl || ''
    },
    members: regularMembers.map(m => ({
      fullName: m.name,
      email: m.email,
      phone: m.phone,
      organization: m.college || team.college,
      yearOfStudy: m.year,
      gender: m.gender,
      githubUrl: m.githubUrl || ''
    }))
  };

  await updateDoc(doc(db, 'registrations', team.id), updatePayload);
}

export async function updateFirestoreTeamStatus(db: Firestore, teamId: string, status: Team['status']) {
  await updateDoc(doc(db, 'registrations', teamId), { status });
}

export async function deleteFirestoreTeam(db: Firestore, teamId: string) {
  await deleteDoc(doc(db, 'registrations', teamId));
}
