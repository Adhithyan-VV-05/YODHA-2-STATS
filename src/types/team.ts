export type TrackType = 'Healthcare' | 'Environment' | 'AI & Robotics' | 'Cybersecurity' | 'Open Hardware';

export type TeamStatus = 'Verified' | 'Pending Review' | 'Submitted' | 'Shortlisted';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  githubUrl?: string;
  role: 'Leader' | 'Member';
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  track: TrackType;
  problemStatementId?: number;
  problemStatementTitle?: string;
  pptLink?: string;
  warriorReferralCode?: string;
  usedReferralCode?: string;
  members: TeamMember[];
  size: number;
  createdAt: string;
  status: TeamStatus;
  githubRepo?: string;
  projectDescription?: string;
}
