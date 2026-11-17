import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SuccessGauge } from './components/SuccessGauge';
import { CalendarStrip } from './components/CalendarStrip';
import { CadenceReminderCard } from './components/CadenceReminderCard';
import { SessionList } from './components/SessionList';
import { Leaderboard } from './components/Leaderboard';
import { LogEntryModal } from './components/LogEntryModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';

import type { HugoUser, DecrypteSession, ParticipantScore } from './types/ddd';
import { 
  loginWithGoogle, 
  logoutUser, 
  subscribeToAuthState 
} from './services/firebase';
import { 
  loadUserSessions, 
  addSession, 
  deleteSession, 
  computeUserStats, 
  buildRealLeaderboard,
  TOTAL_DAYS 
} from './services/storage';
import { Zap, Trophy, History, Lock, LogIn } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<HugoUser | null>(null);
  const [sessions, setSessions] = useState<DecrypteSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<ParticipantScore[]>([]);

  // Date constraints: Check if we are currently in December
  const now = new Date();
  const isDecember = now.getMonth() === 11; // 11 = December in JS Date
  const isBeforeDecember = now.getMonth() < 11;
  const currentDayInDecember = isDecember ? Math.min(TOTAL_DAYS, Math.max(1, now.getDate())) : null;

  // Calculate days until December 1st
  const decFirst = new Date(now.getFullYear(), 11, 1);
  const daysUntilDecember = Math.max(1, Math.ceil((decFirst.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Selected day: default to 1st of December or current December day
  const [selectedDay, setSelectedDay] = useState<number>(currentDayInDecember || 1);
  const [activeTab, setActiveTab] = useState<'challenge' | 'leaderboard' | 'history'>('challenge');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);

  // Load user sessions and auth state
  useEffect(() => {
    const unsub = subscribeToAuthState((u) => {
      setUser(u);
    });

    const loaded = loadUserSessions();
    setSessions(loaded);

    return () => unsub();
  }, []);

  // Refresh leaderboard when user, sessions, or selected day changes
  useEffect(() => {
    buildRealLeaderboard(user, sessions, selectedDay).then((board) => {
      setLeaderboard(board);
    });
  }, [user, sessions, selectedDay]);

  const handleLogin = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
    } catch (err) {
      console.error('Erreur de connexion:', err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const handleAddSession = async (session: DecrypteSession) => {
    if (isBeforeDecember) {
      alert("Impossible d'enregistrer des doses en novembre. Le DDD commence le 1er décembre !");
      return;
    }
    const updated = await addSession(session);
    setSessions(updated);
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSessions(updated);
  };

  // Determine if the currently selected day is locked
  const isSelectedDayLocked = isBeforeDecember || (currentDayInDecember !== null && selectedDay > currentDayInDecember);

  // Statistics
  const stats = computeUserStats(sessions, TOTAL_DAYS);
  const todayCount = stats.countByDay[selectedDay] || 0;

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenFirebaseConfig={() => setIsFirebaseConfigOpen(true)}
      />

      {/* 2. Mandatory Google Login Gate if not authenticated */}
      {!user ? (
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-blue-500/20">
              DDD
            </div>
            
            <h2 className="text-xl font-black text-white">
              Connexion Google Obligatoire
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pour suivre votre progression au <strong>Décembre Décrypte Défi</strong>, synchroniser vos doses et accéder au classement, vous devez obligatoirement vous connecter avec votre compte Google.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
              <div className="font-bold text-white uppercase tracking-wider text-[10px]">Règle du challenge :</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Du 1er au 31 décembre</li>
                <li>1er déc. = 1 actu, 31 déc. = 31 actus</li>
                <li>Total à valider : <strong>496 visionnages</strong></li>
              </ul>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter avec Google</span>
            </button>
          </div>
        </main>
      ) : (
        /* 3. Main Authenticated Application */
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-6 space-y-5">
          
          {/* November Lock Banner */}
          {isBeforeDecember && (
            <div className="rounded-2xl bg-amber-950/30 border border-amber-500/40 p-4 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Le DDD commence le 1er Décembre (dans {daysUntilDecember} jour{daysUntilDecember > 1 ? 's' : ''})
                  </h4>
                  <p className="text-amber-300/80 mt-0.5">
                    Nous sommes en novembre. Le remplissage des doses est strictement verrouillé jusqu'au coup d'envoi officiel le 1er décembre !
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Bar & Single Add Dose Action Button */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('challenge')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'challenge'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Mon Défi</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Classement</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Historique ({stats.totalCount})</span>
              </button>
            </div>

            {/* The ONLY Add Dose Button in the whole app */}
            <button
              disabled={isBeforeDecember || isSelectedDayLocked}
              onClick={() => setIsLogModalOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isBeforeDecember || isSelectedDayLocked
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
              }`}
              title={isBeforeDecember ? "Verrouillé : Début le 1er décembre" : "Ajouter une dose"}
            >
              {isBeforeDecember || isSelectedDayLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Remplissage Verrouillé</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Ajouter une dose ({selectedDay} déc)</span>
                </>
              )}
            </button>
          </div>

          {/* Tab 1: Mon Défi DDD */}
          {activeTab === 'challenge' && (
            <div className="space-y-4">
              {/* Calendrier du 1er au 31 Décembre */}
              <CalendarStrip
                selectedDay={selectedDay}
                onSelectDay={(day) => setSelectedDay(day)}
                countByDay={stats.countByDay}
                maxDays={TOTAL_DAYS}
                isBeforeDecember={isBeforeDecember}
                currentDayInDecember={currentDayInDecember}
              />

              {/* Rappels de Cadence */}
              <CadenceReminderCard
                selectedDay={selectedDay}
                todayCount={todayCount}
                isLocked={isSelectedDayLocked}
              />

              {/* Jauges de Réussite (Jour + Total 496) */}
              <SuccessGauge
                selectedDay={selectedDay}
                todayCount={todayCount}
                totalCount={stats.totalCount}
                totalGoal={stats.totalGoal}
                daysCompleted={stats.daysCompleted}
                maxDays={TOTAL_DAYS}
                isLocked={isSelectedDayLocked}
              />

              {/* Historique des doses du jour sélectionné */}
              <SessionList
                sessions={sessions}
                selectedDay={selectedDay}
                onDeleteSession={handleDeleteSession}
              />
            </div>
          )}

          {/* Tab 2: Classement Réel */}
          {activeTab === 'leaderboard' && (
            <Leaderboard
              participants={leaderboard}
              selectedDay={selectedDay}
            />
          )}

          {/* Tab 3: Historique Complet */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Toutes vos doses validées ({stats.totalCount})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Total nécessaire pour terminer le mois de décembre : {stats.totalGoal}
                  </p>
                </div>
              </div>

              {sessions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800">
                  Aucune session enregistrée pour le moment.
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-400 mr-2">
                        {s.dayNumber} Décembre
                      </span>
                      <span className="font-mono text-slate-300 mr-2">
                        {s.timestamp}
                      </span>
                      {s.videoTitle && (
                        <span className="text-white font-medium mr-2">
                          {s.videoTitle}
                        </span>
                      )}
                      {s.comment && (
                        <span className="text-slate-400 italic">
                          « {s.comment} »
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      className="text-red-400 hover:text-red-300 px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </main>
      )}

      {/* Modals */}
      <LogEntryModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        selectedDay={selectedDay}
        user={user}
        onAddSession={handleAddSession}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
      />

    </div>
  );
};

export default App;
