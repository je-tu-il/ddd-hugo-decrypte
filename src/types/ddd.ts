export interface HugoUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  rankTitle: string;
  joinedAt: string;
}

export type ContentType = 
  | 'actus-du-jour' 
  | 'format-long' 
  | 'interview' 
  | 'short-flash' 
  | 'podcast-elucid' 
  | 'mashup' 
  | 'autre';

export interface DecrypteSession {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  dayNumber: number; // 1 to 24 (or 31)
  dateString: string; // YYYY-MM-DD
  timestamp: string; // HH:mm or ISO
  contentType: ContentType;
  videoTitle?: string;
  comment?: string;
  mentalSaturation: number; // 1 to 5 (1 = Tout va bien, 5 = Surchargé d'actu)
  createdAt: number;
}

export interface DayTarget {
  day: number;
  targetCount: number; // e.g. Day 1 = 1, Day 24 = 24
  completedCount: number;
  isCompleted: boolean;
}

export interface ReminderConfig {
  enabled: boolean;
  cadenceReminders: boolean; // Remind based on remaining count
  soundEnabled: boolean;
  scheduledTimes: string[]; // ["11:00", "15:00", "18:00", "21:30"]
}

export interface ParticipantScore {
  userId: string;
  displayName: string;
  photoURL: string;
  rankTitle: string;
  totalDecrypteCount: number;
  todayCount: number;
  todayTarget: number;
  daysCompletedCount: number; // how many days reached 100%
  currentStreak: number;
  completionPercentage: number;
  lastSessionTime?: string;
  lastVideoTitle?: string;
  isCurrentUser?: boolean;
}

export interface GroupRoom {
  id: string;
  name: string;
  creatorId: string;
  code: string;
}
