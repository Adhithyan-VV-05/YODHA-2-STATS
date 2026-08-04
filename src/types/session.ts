export type DeviceType = 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile';
export type BrowserType = 'Chrome' | 'Edge' | 'Firefox' | 'Safari' | 'Brave' | 'Other';
export type OsType = 'Windows' | 'Mac' | 'Linux' | 'Android' | 'iOS';
export type TabStatus = 'Online' | 'Focused' | 'Background' | 'Offline';

export interface VisitorSession {
  id: string;
  ipHash: string;
  city: string;
  country: string;
  device: DeviceType;
  browser: BrowserType;
  os: OsType;
  screenResolution: string;
  durationSeconds: number;
  activeTimeSeconds: number;
  inactiveTimeSeconds: number;
  pagesViewed: number;
  entryPage: string;
  isBounce: boolean;
  startTime: string;
  endTime?: string;
  lastActive: string;
  isOnline: boolean;
  tabStatus: TabStatus;
}
