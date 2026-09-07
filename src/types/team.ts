export type TrackType = 'Healthcare' | 'Environment' | 'AI & Robotics' | 'Cybersecurity' | 'Open Hardware';

export type TeamStatus = 'Verified' | 'Pending Review' | 'Submitted' | 'Shortlisted';

export type PaymentStatus = 'Pending' | 'Completed' | 'Failed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  githubUrl?: string;
  driveLink?: string;
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
  driveLink?: string;
  warriorReferralCode?: string;
  usedReferralCode?: string;
  members: TeamMember[];
  size: number;
  createdAt: string;
  status: TeamStatus;
  githubRepo?: string;
  projectDescription?: string;
}

export interface SelectedTeam {
  id: string;
  uniqueTeamId: string;
  teamId?: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college?: string;
  track?: string;
  teamSize?: number;
  amountToPay: string | number;
  paymentTime: string;
  paymentStatus: PaymentStatus;
  paymentTxnId?: string;
  paymentNotes?: string;
  createdAt: string;
  updatedAt?: string;
}


