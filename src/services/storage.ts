import type { DecrypteSession, ParticipantScore, HugoUser } from '../types/ddd';
import { calculateTotalGoal } from '../constants/hugoData';
import { syncSessionToCloud, getCloudUsers, getCloudSessions } from './firebase';

const SESSIONS_STORAGE_KEY = 'ddd_hugo_sessions_v2';
export const TOTAL_DAYS = 31; // 1st to 31st of December

export function loadUserSessions(): DecrypteSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sessions:', e);
  }
  return [];
}

export function saveUserSessions(sessions: DecrypteSession[]) {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

export async function addSession(session: DecrypteSession): Promise<DecrypteSession[]> {
  const current = loadUserSessions();
  const updated = [session, ...current];
  saveUserSessions(updated);
  await syncSessionToCloud(session);
  return updated;
}

export function deleteSession(id: string): DecrypteSession[] {
  const current = loadUserSessions();
  const updated = current.filter((s) => s.id !== id);
  saveUserSessions(updated);
  return updated;
}

// Compute statistics for a list of sessions
export function computeUserStats(sessions: DecrypteSession[], maxDays: number = 31) {
  const totalGoal = calculateTotalGoal(maxDays); // (31*32)/2 = 496
  const totalCount = sessions.length;
  
  const countByDay: Record<number, number> = {};
  for (let d = 1; d <= maxDays; d++) {
    countByDay[d] = 0;
  }
  sessions.forEach((s) => {
    if (s.dayNumber >= 1 && s.dayNumber <= maxDays) {
      countByDay[s.dayNumber] = (countByDay[s.dayNumber] || 0) + 1;
    }
  });

  let daysCompleted = 0;
  for (let d = 1; d <= maxDays; d++) {
    if (countByDay[d] >= d) {
      daysCompleted++;
    }
  }

  const completionPercentage = Math.min(100, Math.round((totalCount / totalGoal) * 100));

  return {
    totalCount,
    totalGoal,
    daysCompleted,
    countByDay,
    completionPercentage,
  };
}

// Build REAL leaderboard (only actual authenticated users, NO bots/fakes)
export async function buildRealLeaderboard(
  currentUser: HugoUser | null,
  userSessions: DecrypteSession[],
  selectedDay: number
): Promise<ParticipantScore[]> {
  const userStats = computeUserStats(userSessions, TOTAL_DAYS);
  const todayCount = userStats.countByDay[selectedDay] || 0;

  // Try to load real users & sessions from cloud
  const cloudUsers = await getCloudUsers();
  const cloudSessions = await getCloudSessions();

  if (cloudUsers.length > 0) {
    // Map each cloud user to their real stats
    return cloudUsers.map((u) => {
      const uSessions = cloudSessions.filter((s) => s.userId === u.uid);
      const uStats = computeUserStats(uSessions, TOTAL_DAYS);
      const isMe = currentUser?.uid === u.uid;

      return {
        userId: u.uid,
        displayName: u.displayName || 'Participant',
        photoURL: u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`,
        rankTitle: isMe ? 'Connecté' : 'Participant',
        totalDecrypteCount: isMe ? Math.max(userStats.totalCount, uStats.totalCount) : uStats.totalCount,
        todayCount: isMe ? Math.max(todayCount, uStats.countByDay[selectedDay] || 0) : (uStats.countByDay[selectedDay] || 0),
        todayTarget: selectedDay,
        daysCompletedCount: isMe ? userStats.daysCompleted : uStats.daysCompleted,
        currentStreak: 0,
        completionPercentage: isMe ? userStats.completionPercentage : uStats.completionPercentage,
        isCurrentUser: isMe,
      };
    }).sort((a, b) => b.totalDecrypteCount - a.totalDecrypteCount);
  }

  // If no cloud connection or only current user
  if (!currentUser) return [];

  return [{
    userId: currentUser.uid,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    rankTitle: 'Connecté (Vous)',
    totalDecrypteCount: userStats.totalCount,
    todayCount,
    todayTarget: selectedDay,
    daysCompletedCount: userStats.daysCompleted,
    currentStreak: 0,
    completionPercentage: userStats.completionPercentage,
    isCurrentUser: true,
  }];
}
