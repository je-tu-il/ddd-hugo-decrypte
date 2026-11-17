export interface CadenceDiagnosis {
  dayNumber: number;
  targetCount: number;
  completedCount: number;
  remainingCount: number;
  minutesLeftToday: number;
  cadenceMinutes: number | null; // how many minutes between videos to make it
  urgency: 'completed' | 'chill' | 'warning' | 'critical';
  title: string;
  message: string;
  recommendation: string;
}

// Synthesize a clean Hugo-themed notification chime using the Web Audio API
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // News intro chord (F -> Bb -> C)
    const now = ctx.currentTime;
    osc1.frequency.setValueAtTime(440, now); // A4
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.frequency.setValueAtTime(554.37, now); // C#5
    osc2.frequency.exponentialRampToValueAtTime(1108.73, now + 0.15);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.debug('Web audio not allowed or unsupported:', err);
  }
}

// Request permission for Web Notifications
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function sendLocalNotification(title: string, body: string) {
  playNotificationSound();
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=128&q=80',
        badge: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=96&q=80',
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
}

// Calculate the smart cadence diagnosis based on target count and time left
export function calculateCadence(dayNumber: number, completedCount: number): CadenceDiagnosis {
  const targetCount = dayNumber; // Day 1 = 1, Day 24 = 24
  const remainingCount = Math.max(0, targetCount - completedCount);

  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const minutesLeftToday = Math.max(1, Math.round((endOfDay.getTime() - now.getTime()) / 60000));

  if (remainingCount === 0) {
    return {
      dayNumber,
      targetCount,
      completedCount,
      remainingCount: 0,
      minutesLeftToday,
      cadenceMinutes: null,
      urgency: 'completed',
      title: '🎉 Objectif du Jour Validé !',
      message: `Vous avez validé vos ${targetCount} Hugo Décrypte du jour !`,
      recommendation: "Prenez soin de vous et de vos proches. Rendez-vous demain pour la dose suivante !",
    };
  }

  const cadenceMinutes = Math.floor(minutesLeftToday / remainingCount);

  if (cadenceMinutes >= 90) {
    return {
      dayNumber,
      targetCount,
      completedCount,
      remainingCount,
      minutesLeftToday,
      cadenceMinutes,
      urgency: 'chill',
      title: '🟢 Rythme Tranquille',
      message: `Il vous reste ${remainingCount} décryptage(s) à faire sur ${targetCount}.`,
      recommendation: `Cadence très sereine : 1 Hugo Décrypte toutes les ${Math.floor(cadenceMinutes / 60)}h${(cadenceMinutes % 60).toString().padStart(2, '0')}.`,
    };
  } else if (cadenceMinutes >= 30) {
    return {
      dayNumber,
      targetCount,
      completedCount,
      remainingCount,
      minutesLeftToday,
      cadenceMinutes,
      urgency: 'warning',
      title: '🟡 Cadence Active',
      message: `Attention, il vous reste ${remainingCount} vidéo(s) à caser avant minuit !`,
      recommendation: `Cadence recommandée : 1 Hugo Décrypte toutes les ${cadenceMinutes} minutes pour rester dans les temps.`,
    };
  } else {
    return {
      dayNumber,
      targetCount,
      completedCount,
      remainingCount,
      minutesLeftToday,
      cadenceMinutes,
      urgency: 'critical',
      title: '🚨 URGENCE FLASH ACTU !',
      message: `Situation critique : ${remainingCount} Hugo Décrypte restants en seulement ${Math.floor(minutesLeftToday / 60)}h ${minutesLeftToday % 60}m !`,
      recommendation: `Cadence intense : 1 vidéo toutes les ${Math.max(5, cadenceMinutes)} minutes ! Activez les Shorts ou les Actus du Jour en vitesse x1.5 !`,
    };
  }
}
