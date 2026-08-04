export type ActivityType = 
  | 'team_registered' 
  | 'visitor_joined' 
  | 'session_ended' 
  | 'registration_updated' 
  | 'registration_deleted' 
  | 'milestone_reached'
  | 'system_alert';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  category: 'Registration' | 'Visitor' | 'System' | 'Track';
  metadata?: Record<string, any>;
  severity?: 'info' | 'success' | 'warning' | 'alert';
}
