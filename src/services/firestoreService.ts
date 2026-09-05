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

function parseFirestoreDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return new Date(val).toISOString();
  if (typeof val === 'object') {
    if (val.seconds) return new Date(val.seconds * 1000).toISOString();
    if (typeof val.toDate === 'function') return val.toDate().toISOString();
  }
  return new Date().toISOString();
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
    const rawDocsMap = new Map<string, { id: string; data: any }>();

    const processSnapshot = () => {
      const teams: Team[] = [];

      rawDocsMap.forEach(({ id: docId, data: d }) => {
        const leaderObj = d.leader || {};
        const leaderName = leaderObj.fullName || leaderObj.name || d.leaderName || d.leader_name || d.teamName || 'Leader';
        const leaderEmail = leaderObj.email || d.leaderEmail || d.leader_email || d.email || '';
        const leaderPhone = leaderObj.phone || d.leaderPhone || d.leader_phone || d.phone || '';
        const college = leaderObj.organization || leaderObj.college || d.college || d.institution || d.university || d.organization || 'N/A';
        const year = leaderObj.yearOfStudy || leaderObj.year || d.yearOfStudy || d.year || '3rd Year';
        const gender = leaderObj.gender || d.gender || 'Male';
        const githubUrl = leaderObj.githubUrl || leaderObj.github || d.githubUrl || d.github_url || d.github || '';

        // Extract Drive Link / PPT Link from all common Firestore field names
        const rawDriveLink =
          d.driveLink ||
          d.drive_link ||
          d.googleDriveLink ||
          d.google_drive_link ||
          d.pptLink ||
          d.ppt_link ||
          d.presentationLink ||
          d.submissionLink ||
          d.drive ||
          d.link ||
          d.pdfLink ||
          d.projectLink ||
          d.repoUrl ||
          leaderObj.driveLink ||
          leaderObj.pptLink ||
          '';

        const driveLink = rawDriveLink ? String(rawDriveLink).trim() : undefined;
        const pptLink = driveLink;

        const leaderMember: TeamMember = {
          id: `mbr-${docId}-leader`,
          name: leaderName,
          email: leaderEmail,
          phone: leaderPhone,
          college,
          year,
          gender,
          githubUrl: githubUrl || undefined,
          driveLink,
          role: 'Leader'
        };

        const rawMembersList = Array.isArray(d.members)
          ? d.members
          : Array.isArray(d.teamMembers)
          ? d.teamMembers
          : Array.isArray(d.participants)
          ? d.participants
          : [];

        const otherMembers: TeamMember[] = rawMembersList.map((m: any, idx: number) => ({
          id: `mbr-${docId}-${idx}`,
          name: m.fullName || m.name || `Member ${idx + 1}`,
          email: m.email || '',
          phone: m.phone || '',
          college: m.organization || m.college || college,
          year: m.yearOfStudy || m.year || year || '3rd Year',
          gender: m.gender || 'Male',
          githubUrl: m.githubUrl || m.github || undefined,
          driveLink: m.driveLink || m.pptLink || undefined,
          role: 'Member'
        }));

        const allMembers = [leaderMember, ...otherMembers];

        // Parse registration timestamp robustly
        const createdAt = parseFirestoreDate(
          d.submittedAt || d.createdAt || d.timestamp || d.registeredAt || d.date || d.created_at
        );

        teams.push({
          id: docId,
          name: d.teamName || d.name || `Team-${docId.substring(0, 5)}`,
          leaderName,
          leaderEmail,
          leaderPhone,
          college,
          track: mapTrackName(d.track || d.trackType || d.category),
          problemStatementId: d.problemStatementId || d.problemId || undefined,
          problemStatementTitle: d.problemStatementTitle || d.problemStatement || d.problemTitle || undefined,
          pptLink,
          driveLink,
          warriorReferralCode: d.warriorReferralCode || d.referralCode || undefined,
          usedReferralCode: d.usedReferralCode || undefined,
          members: allMembers,
          size: d.teamSize || allMembers.length,
          createdAt,
          status: d.status || 'Verified',
          projectDescription: d.projectDescription || d.description || d.abstract || undefined
        });
      });

      // STRICTLY SORT LATEST REGISTRATIONS FIRST (Descending by createdAt timestamp)
      teams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      onData(teams);
    };

    // Subscribe to both 'teams' and 'registrations' collections to guarantee all records are captured
    const qTeams = query(collection(db, 'teams'));
    const qRegs = query(collection(db, 'registrations'));

    const unsubTeams = onSnapshot(qTeams, (snapshot) => {
      snapshot.forEach(docSnap => {
        rawDocsMap.set(docSnap.id, { id: docSnap.id, data: docSnap.data() });
      });
      processSnapshot();
    }, onError);

    const unsubRegs = onSnapshot(qRegs, (snapshot) => {
      snapshot.forEach(docSnap => {
        rawDocsMap.set(docSnap.id, { id: docSnap.id, data: docSnap.data() });
      });
      processSnapshot();
    }, () => {});

    return () => {
      unsubTeams();
      unsubRegs();
    };
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
    const q = query(collection(db, 'user_sessions'), limit(200));
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

        const durationSeconds = typeof d.totalDurationSeconds === 'number'
          ? d.totalDurationSeconds
          : (typeof d.durationSeconds === 'number' ? d.durationSeconds : 0);

        const activeTimeSeconds = typeof d.activeDurationSeconds === 'number'
          ? d.activeDurationSeconds
          : (typeof d.activeTimeSeconds === 'number' ? d.activeTimeSeconds : Math.round(durationSeconds * 0.85));

        const inactiveTimeSeconds = typeof d.inactiveDurationSeconds === 'number'
          ? d.inactiveDurationSeconds
          : (typeof d.inactiveTimeSeconds === 'number' ? d.inactiveTimeSeconds : Math.max(0, durationSeconds - activeTimeSeconds));

        const isOnline = d.isOnline !== undefined ? Boolean(d.isOnline) : ((now - lastActiveMs) < 3 * 60 * 1000);
        
        let tabStatus: TabStatus = 'Offline';
        if (isOnline) {
          tabStatus = d.isTabActive ? 'Focused' : 'Background';
        } else {
          tabStatus = 'Offline';
        }

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
          screenResolution: d.screenResolution || d.viewportResolution || '1920x1080',
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
  const payload = {
    ...team,
    driveLink: team.driveLink || team.pptLink || '',
    pptLink: team.pptLink || team.driveLink || '',
    googleDriveLink: team.driveLink || team.pptLink || ''
  };
  await setDoc(doc(db, 'registrations', team.id), payload).catch(() => {});
  await setDoc(doc(db, 'teams', team.id), payload).catch(() => {});
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
    pptLink: team.pptLink || team.driveLink || '',
    driveLink: team.driveLink || team.pptLink || '',
    googleDriveLink: team.driveLink || team.pptLink || '',
    projectDescription: team.projectDescription || '',
    leader: {
      fullName: leaderMember?.name || team.leaderName,
      email: leaderMember?.email || team.leaderEmail,
      phone: leaderMember?.phone || team.leaderPhone,
      organization: team.college,
      yearOfStudy: leaderMember?.year || '3rd Year',
      gender: leaderMember?.gender || 'Male',
      githubUrl: leaderMember?.githubUrl || '',
      driveLink: leaderMember?.driveLink || team.driveLink || ''
    },
    members: regularMembers.map(m => ({
      fullName: m.name,
      email: m.email,
      phone: m.phone,
      organization: m.college || team.college,
      yearOfStudy: m.year,
      gender: m.gender,
      githubUrl: m.githubUrl || '',
      driveLink: m.driveLink || ''
    }))
  };

  try {
    await updateDoc(doc(db, 'registrations', team.id), updatePayload);
  } catch {
    await setDoc(doc(db, 'registrations', team.id), updatePayload, { merge: true }).catch(() => {});
  }
  try {
    await updateDoc(doc(db, 'teams', team.id), updatePayload);
  } catch {
    await setDoc(doc(db, 'teams', team.id), updatePayload, { merge: true }).catch(() => {});
  }
}

export async function updateFirestoreTeamStatus(db: Firestore, teamId: string, status: Team['status']) {
  try {
    await updateDoc(doc(db, 'registrations', teamId), { status });
  } catch {
    await setDoc(doc(db, 'registrations', teamId), { status }, { merge: true }).catch(() => {});
  }
  try {
    await updateDoc(doc(db, 'teams', teamId), { status });
  } catch {
    await setDoc(doc(db, 'teams', teamId), { status }, { merge: true }).catch(() => {});
  }
}

export async function deleteFirestoreTeam(db: Firestore, teamId: string) {
  await deleteDoc(doc(db, 'registrations', teamId)).catch(() => {});
  await deleteDoc(doc(db, 'teams', teamId)).catch(() => {});
}

export interface ReferralRoom {
  id: string;
  referralCode: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  totalReferrals: number;
  createdAt: string;
  lastReferralAt?: string;
}

export interface ReferredTeamEntry {
  id: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  registeredAt: string;
}

export function subscribeToReferralRooms(
  db: Firestore,
  onData: (rooms: ReferralRoom[]) => void,
  onError: (err: any) => void
) {
  try {
    const q = query(collection(db, 'referral_rooms'));
    return onSnapshot(q, (snapshot) => {
      const rooms: ReferralRoom[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let createdAt = new Date().toISOString();
        if (d.createdAt && d.createdAt.seconds) {
          createdAt = new Date(d.createdAt.seconds * 1000).toISOString();
        } else if (d.createdAt) {
          createdAt = d.createdAt;
        }

        let lastReferralAt: string | undefined = undefined;
        if (d.lastReferralAt && d.lastReferralAt.seconds) {
          lastReferralAt = new Date(d.lastReferralAt.seconds * 1000).toISOString();
        } else if (d.lastReferralAt) {
          lastReferralAt = d.lastReferralAt;
        }

        rooms.push({
          id: docSnap.id,
          referralCode: d.referralCode || docSnap.id,
          teamId: d.teamId || '',
          teamName: d.teamName || 'Unknown Team',
          leaderName: d.leaderName || 'Unknown Leader',
          leaderEmail: d.leaderEmail || '',
          leaderPhone: d.leaderPhone || '',
          totalReferrals: d.totalReferrals || 0,
          createdAt,
          lastReferralAt,
        });
      });
      rooms.sort((a, b) => b.totalReferrals - a.totalReferrals);
      onData(rooms);
    }, onError);
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeToRoomReferrals(
  db: Firestore,
  referralCode: string,
  onData: (entries: ReferredTeamEntry[]) => void,
  onError: (err: any) => void
) {
  try {
    const q = query(collection(db, 'referral_rooms', referralCode, 'referrals'));
    return onSnapshot(q, (snapshot) => {
      const entries: ReferredTeamEntry[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let registeredAt = new Date().toISOString();
        if (d.registeredAt && d.registeredAt.seconds) {
          registeredAt = new Date(d.registeredAt.seconds * 1000).toISOString();
        } else if (d.registeredAt) {
          registeredAt = d.registeredAt;
        }

        entries.push({
          id: docSnap.id,
          teamId: d.teamId || docSnap.id,
          teamName: d.teamName || 'Unknown Team',
          leaderName: d.leaderName || 'Unknown Leader',
          leaderEmail: d.leaderEmail || '',
          leaderPhone: d.leaderPhone || '',
          registeredAt,
        });
      });
      onData(entries);
    }, onError);
  } catch (err) {
    onError(err);
    return () => {};
  }
}
