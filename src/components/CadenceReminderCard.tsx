import React, { useState } from 'react';
import { Bell, BellRing, Volume2, Clock, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { 
  calculateCadence, 
  playNotificationSound, 
  requestNotificationPermission, 
  sendLocalNotification 
} from '../services/notifications';

interface CadenceReminderCardProps {
  selectedDay: number;
  todayCount: number;
  isLocked: boolean;
}

export const CadenceReminderCard: React.FC<CadenceReminderCardProps> = ({
  selectedDay,
  todayCount,
  isLocked,
}) => {
  const [notificationsGranted, setNotificationsGranted] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const diagnosis = calculateCadence(selectedDay, todayCount);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsGranted(granted);
    if (granted) {
      sendLocalNotification(
        '🔔 Rappels DDD Activés !',
        `Vous recevrez des rappels selon votre quota quotidien.`
      );
    }
  };

  const handleTestChime = () => {
    playNotificationSound();
  };

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            ⏳ Rappels inactifs : ce jour n'est pas encore ouvert. Le système de cadence s'activera le jour J.
          </span>
        </div>
      </div>
    );
  }

  const getUrgencyStyles = () => {
    switch (diagnosis.urgency) {
      case 'completed':
        return {
          bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
      case 'chill':
        return {
          bg: 'bg-blue-950/20 border-blue-500/30 text-blue-300',
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: <Clock className="w-4 h-4 text-blue-400" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/20 border-amber-500/30 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'critical':
      default:
        return {
          bg: 'bg-red-950/25 border-red-500/40 text-red-200',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: <Zap className="w-4 h-4 text-red-400" />,
        };
    }
  };

  const styles = getUrgencyStyles();

  return (
    <div className={`rounded-2xl border p-4 backdrop-blur-md transition-all ${styles.bg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            {styles.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rappel de cadence du jour
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                {diagnosis.title}
              </span>
            </div>
            <p className="text-xs font-semibold text-white mt-0.5">
              {diagnosis.recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleEnableNotifications}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              notificationsGranted
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
            }`}
          >
            {notificationsGranted ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            <span>{notificationsGranted ? 'Rappels Activés' : 'Activer Rappels'}</span>
          </button>

          <button
            onClick={handleTestChime}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title="Tester le son"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
