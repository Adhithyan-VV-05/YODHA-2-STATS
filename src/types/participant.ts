import type { TrackType } from './team';

export interface Participant {
  id: string;
  teamId: string;
  teamName: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  track: TrackType;
  role: 'Leader' | 'Member';
  githubUrl?: string;
  hasGithub: boolean;
  registeredAt: string;
}
